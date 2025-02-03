const db = require("../models");
const Siswa = db.siswa;
const DetailAlamat = db.detailalamatsiswa;
const fs = require("fs");
const apiConfig = require("../configs/apiConfig");
const Op = db.Sequelize.Op; // Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  try {
    const { siswa_foto } = req.file;

    // Validasi siswa_foto
    // if (!siswa_foto || siswa_foto.length === 0) {
    //   return res.status(400).send({
    //     message: "Foto siswa harus diupload",
    //   });
    // }

    // Validate request
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Username and password are required!" });
    }

    // Hash password securely using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Buat detail alamat terlebih dahulu
    const detailAlamat = await DetailAlamat.create({
      rt: req.body.rt,
      rw: req.body.rw,
      desa: req.body.desa,
      kota_kabupaten: req.body.kota_kabupaten,
      nama_jalan: req.body.nama_jalan,
      alamat_lengkap: req.body.alamat_lengkap,
      kecamatan: req.body.kecamatan,
      provinsi: req.body.provinsi,
    });

    const fotoSiswa = siswa_foto ? siswa_foto.filename : null;
    const urlFotoSiswa = siswa_foto
      ? `${apiConfig.BASE_URL}/siswa/${siswa_foto.filename}`
      : null;

    // Hapus req.body.id_alamat karena akan menggunakan id dari detail alamat yang baru dibuat
    const siswa = {
      nama_lengkap: req.body.nama_lengkap,
      id_alamat: detailAlamat.id, // Otomatis menggunakan ID dari alamat yang baru dibuat
      nis: req.body.nis,
      nisn: req.body.nisn,
      kelas: req.body.kelas,
      jurusan: req.body.jurusan,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      foto_siswa: fotoSiswa,
      url_foto_siswa: urlFotoSiswa,
    };

    const newSiswa = await Siswa.create(siswa);

    // Ambil data siswa beserta detail alamatnya
    const siswaWithDetail = await Siswa.findByPk(newSiswa.id, {
      include: [
        {
          model: DetailAlamat,
          as: "detailAlamatSiswa",
          attributes: [
            "id",
            "alamat_lengkap",
            "kota_kabupaten",
            "nama_jalan",
            "rt",
            "rw",
            "desa",
            "kecamatan",
            "provinsi",
          ],
        },
      ],
    });

    res.status(201).send(siswaWithDetail);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const siswa = await Siswa.findByPk(id, {
      include: [
        {
          model: DetailAlamat,
          as: "detailAlamatSiswa",
          attributes: [
            "id",
            "alamat_lengkap",
            "kota_kabupaten",
            "nama_jalan",
            "rt",
            "rw",
            "desa",
            "kecamatan",
            "provinsi",
          ],
        },
      ],
      attributes: {
        exclude: ["password"], // Tidak menampilkan password dalam response
      },
    });

    if (!siswa) {
      return res.status(404).send({
        message: "Siswa tidak ditemukan",
      });
    }

    res.status(200).send({
      message: "Data siswa ditemukan",
      data: siswa,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Terjadi kesalahan saat mengambil data siswa",
    });
  }
};

exports.findAll = async (req, res) => {
  Siswa.findAll({
    include: [
      {
        model: DetailAlamat,
        as: "detailAlamatSiswa",
        attributes: [
          "id",
          "alamat_lengkap",
          "kota_kabupaten",
          "nama_jalan",
          "rt",
          "rw",
          "desa",
          "kecamatan",
          "provinsi",
        ],
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil Paket.",
      });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // Cek apakah siswa exists
    const existingSiswa = await Siswa.findByPk(id);
    if (!existingSiswa) {
      return res.status(404).send({
        message: "Siswa tidak ditemukan",
      });
    }

    // Update password jika ada
    let updateData = { ...req.body };
    if (req.body.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    // Update foto jika ada
    if (req.file) {
      // Hapus foto lama jika ada
      if (existingSiswa.foto_siswa) {
        const oldPhotoPath = `./public/siswa/${existingSiswa.foto_siswa}`;
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      updateData.foto_siswa = req.file.filename;
      updateData.url_foto_siswa = `${apiConfig.BASE_URL}/siswa/${req.file.filename}`;
    }

    // Update detail alamat jika ada
    if (existingSiswa.id_alamat) {
      await DetailAlamat.update(
        {
          rt: req.body.rt,
          rw: req.body.rw,
          desa: req.body.desa,
          kota_kabupaten: req.body.kota_kabupaten,
          nama_jalan: req.body.nama_jalan,
          alamat_lengkap: req.body.alamat_lengkap,
          kecamatan: req.body.kecamatan,
          provinsi: req.body.provinsi,
        },
        {
          where: { id: existingSiswa.id_alamat },
        }
      );
    }

    // Update data siswa
    await Siswa.update(updateData, {
      where: { id: id },
    });

    // Ambil data yang sudah diupdate
    const updatedSiswa = await Siswa.findByPk(id, {
      include: [
        {
          model: DetailAlamat,
          as: "detailAlamatSiswa",
          attributes: [
            "id",
            "alamat_lengkap",
            "kota_kabupaten",
            "nama_jalan",
            "rt",
            "rw",
            "desa",
            "kecamatan",
            "provinsi",
          ],
        },
      ],
    });

    res.status(200).send({
      message: "Data siswa berhasil diupdate",
      data: updatedSiswa,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Terjadi kesalahan saat mengupdate data siswa",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // Cek apakah siswa exists
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).send({
        message: "Siswa tidak ditemukan",
      });
    }

    // Hapus foto siswa jika ada
    if (siswa.foto_siswa) {
      const photoPath = `./public/siswa/${siswa.foto_siswa}`;
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Hapus detail alamat
    if (siswa.id_alamat) {
      await DetailAlamat.destroy({
        where: { id: siswa.id_alamat },
      });
    }

    // Hapus data siswa
    await Siswa.destroy({
      where: { id: id },
    });

    res.status(200).send({
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Terjadi kesalahan saat menghapus data siswa",
    });
  }
};
