const db = require("../models");
const Siswa = db.siswa;
const DetailAlamat = db.detailalamatsiswa;
const fs = require("fs");
const path = require("path");
const apiConfig = require("../configs/apiConfig");
const Op = db.Sequelize.Op; // Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  try {
    const { foto } = req.files;

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
      foto_siswa: foto ? foto[0].filename : null,
      url_foto_siswa: foto ? `${apiConfig}/siswa/${foto[0].filename}` : null,
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

exports.findAll = async (req, res) => {
  Siswa.findAll({
    include: [
      {
        model: DetailAlamat,
        as: "detailAlamatSiswa",
        attributes: [
          "id",
          "alamat",
          "rt",
          "rw",
          "desa",
          "kecamatan",
          "kabupaten",
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
