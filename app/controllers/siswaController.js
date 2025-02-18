const db = require("../models");
const Siswa = db.siswa;
const DetailAlamat = db.detailalamatsiswa;
const Kelas = db.kelas;
const Jurusan = db.jurusan;
const fs = require("fs");
const apiConfig = require("../configs/apiConfig");
const Op = db.Sequelize.Op; // Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

exports.create = async(req, res) => {
    try {
        // Validate request
        if (!req.body.nama_lengkap || !req.body.password) {
            return res
                .status(400)
                .send({ message: "Username and password are required!" });
        }

        // Validasi kelas dan jurusan exist
        const kelas = await Kelas.findByPk(req.body.id_kelas);
        if (!kelas) {
            return res.status(400).send({ message: "Kelas tidak ditemukan!" });
        }

        const jurusan = await Jurusan.findByPk(req.body.id_jurusan);
        if (!jurusan) {
            return res.status(400).send({ message: "Jurusan tidak ditemukan!" });
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
            dusun: req.body.dusun,
            kelurahan: req.body.kelurahan,
            kecamatan: req.body.kecamatan,
            provinsi: req.body.provinsi,
        });

        // Modified photo handling
        const fotoSiswa = req.file ? req.file.filename : null;
        const urlFotoSiswa = req.file ?
            `${apiConfig.BASE_URL}/siswa/${req.file.filename}` :
            null;

        // Hapus req.body.id_alamat karena akan menggunakan id dari detail alamat yang baru dibuat
        const siswa = {
            nama_lengkap: req.body.nama_lengkap,
            id_alamat: detailAlamat.id, // Otomatis menggunakan ID dari alamat yang baru dibuat
            nis: req.body.nis,
            id_kelas: req.body.id_kelas,
            id_jurusan: req.body.id_jurusan,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            foto_siswa: fotoSiswa,
            url_foto_siswa: urlFotoSiswa,
        };

        const newSiswa = await Siswa.create(siswa);

        // Ambil data siswa dengan semua relasinya
        const siswaWithDetail = await Siswa.findByPk(newSiswa.id, {
            include: [{
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
                        "dusun",
                        "kelurahan",
                        "kecamatan",
                        "provinsi",
                    ],
                },
                {
                    model: Kelas,
                    as: "kelasInfo",
                    attributes: ["id", "nama_kelas"],
                },
                {
                    model: Jurusan,
                    as: "jurusanInfo",
                    attributes: ["id", "nama_jurusan"],
                },
            ],
            attributes: {
                exclude: ["password"],
            },
        });

        res.status(201).send(siswaWithDetail);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findOne = async(req, res) => {
    try {
        const id = req.params.id;

        const siswa = await Siswa.findByPk(id, {
            include: [{
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
                        "dusun",
                        "kelurahan",
                        "kecamatan",
                        "provinsi",
                    ],
                },
                {
                    model: Kelas,
                    as: "kelasInfo",
                    attributes: ["id", "nama_kelas"],
                },
                {
                    model: Jurusan,
                    as: "jurusanInfo",
                    attributes: ["id", "nama_jurusan"],
                },
            ],
            attributes: {
                exclude: ["password"],
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

exports.findAll = async(req, res) => {
    try {
        const data = await Siswa.findAll({
            include: [{
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
                        "dusun",
                        "kelurahan",
                        "kecamatan",
                        "provinsi",
                    ],
                },
                {
                    model: Kelas,
                    as: "kelasInfo",
                    attributes: ["id", "nama_kelas"],
                },
                {
                    model: Jurusan,
                    as: "jurusanInfo",
                    attributes: ["id", "nama_jurusan"],
                },
            ],
            attributes: {
                exclude: ["password"],
            },
        });

        res.status(200).send({
            data: data,
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Terjadi kesalahan saat mengambil data siswa.",
        });
    }
};

exports.update = async(req, res) => {
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
        let updateData = {...req.body };
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
            await DetailAlamat.update({
                rt: req.body.rt,
                rw: req.body.rw,
                desa: req.body.desa,
                kota_kabupaten: req.body.kota_kabupaten,
                nama_jalan: req.body.nama_jalan,
                alamat_lengkap: req.body.alamat_lengkap,
                dusun: req.body.dusun,
                kelurahan: req.body.kelurahan,
                kecamatan: req.body.kecamatan,
                provinsi: req.body.provinsi,
            }, {
                where: { id: existingSiswa.id_alamat },
            });
        }

        // Update data siswa
        await Siswa.update(updateData, {
            where: { id: id },
        });

        // Ambil data yang sudah diupdate
        const updatedSiswa = await Siswa.findByPk(id, {
            include: [{
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
                    "dusun",
                    "kelurahan",
                    "kecamatan",
                    "provinsi",
                ],
            }, ],
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

exports.delete = async(req, res) => {
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