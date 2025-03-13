const db = require("../models");
const Pembimbing = db.pembimbing;
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const apiConfig = require("../configs/apiConfig");

// Create and Save a new Pembimbing
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.nip || !req.body.nama_pembimbing) {
    res.status(400).send({
      message: "NIP dan nama pembimbing tidak boleh kosong!",
    });
    return;
  }

  let foto_pembimbings = null;
  let url_foto_pembimbings = null;

  if (req.file) {
    foto_pembimbings = req.file.filename;
    url_foto_pembimbings = `${req.protocol}://${req.get("host")}/pembimbing/${
      req.file.filename
    }`;
  }

  // Hash password securely using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // Create a Pembimbing
  const pembimbing = {
    nip: req.body.nip,
    nama_pembimbing: req.body.nama_pembimbing,
    email: req.body.email,
    password: hashedPassword,
    foto_pembimbing: foto_pembimbings,
    url_foto_pembimbing: url_foto_pembimbings,
  };

  // Save Pembimbing in the database
  Pembimbing.create(pembimbing)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi error saat membuat data pembimbing.",
      });
    });
};

// Retrieve all Pembimbing from the database
exports.findAll = async (req, res) => {
  try {
    const pembimbing = await Pembimbing.findAll({
      attributes: [
        "id",
        "nip",
        "nama_pembimbing",
        "email",
        "foto_pembimbing",
        "url_foto_pembimbing",
        "createdAt",
        "updatedAt",
      ],
    });

    res.send({
      status: "success",
      message: "Data pembimbing berhasil diambil",
      data: pembimbing,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message || "Terjadi error saat mengambil data pembimbing.",
    });
  }
};

// Find a single Pembimbing with an id
exports.findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const pembimbing = await Pembimbing.findOne({
      where: { id },
      attributes: [
        "id",
        "nip",
        "nama_pembimbing",
        "email",
        "foto_pembimbing",
        "url_foto_pembimbing",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!pembimbing) {
      return res.status(404).send({
        status: "error",
        message: `Pembimbing dengan id=${id} tidak ditemukan.`,
      });
    }

    res.send({
      status: "success",
      message: "Data pembimbing berhasil diambil",
      data: pembimbing,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error mengambil pembimbing dengan id=${id}`,
    });
  }
};

// Update a Pembimbing by the id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const pembimbing = await Pembimbing.findByPk(id);

    if (!pembimbing) {
      return res.status(404).send({
        message: `Pembimbing dengan id=${id} tidak ditemukan.`,
      });
    }

    // Periksa apakah ada file yang diupload
    if (!req.file) {
      // Update data tanpa foto
      await pembimbing.update({
        nama_pembimbing: req.body.nama_pembimbing || pembimbing.nama_pembimbing,
        nip: req.body.nip || pembimbing.nip,
        email: req.body.email || pembimbing.email,
      });

      return res.send({
        message: "Pembimbing berhasil diperbarui.",
        data: pembimbing,
      });
    }

    // Jika ada file foto baru
    const deleteOldFile = (oldFilename) => {
      if (oldFilename) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "pembimbing",
          oldFilename
        );
        return new Promise((resolve, reject) => {
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Gagal menghapus file lama:", err);
                reject(err);
              }
              resolve();
            });
          } else {
            // Jika file tidak ditemukan, lanjutkan saja
            resolve();
          }
        });
      }
      return Promise.resolve();
    };

    // Hapus foto lama dan update dengan yang baru
    await deleteOldFile(pembimbing.foto_pembimbing);

    // Pastikan nama file dan URL diambil dengan benar
    const newFilename = req.file.filename;
    const newFileUrl = `${req.protocol}://${req.get(
      "host"
    )}/pembimbing/${newFilename}`;

    await pembimbing.update({
      foto_pembimbing: newFilename,
      url_foto_pembimbing: newFileUrl,
      nama_pembimbing: req.body.nama_pembimbing || pembimbing.nama_pembimbing,
      nip: req.body.nip || pembimbing.nip,
      email: req.body.email || pembimbing.email,
    });

    res.send({
      message: "Pembimbing berhasil diperbarui.",
      data: pembimbing,
    });
  } catch (err) {
    console.error("Error updating pembimbing:", err);
    res.status(500).send({
      message: "Error mengupdate Pembimbing dengan id=" + id,
      error: err.message,
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Pembimbing.findByPk(id)
    .then((pembimbing) => {
      if (!pembimbing) {
        return res.status(404).send({
          message: `Pembimbing dengan id=${id} tidak ditemukan.`,
        });
      }

      // Hapus foto jika ada
      if (pembimbing.foto_pembimbing) {
        const filePath = path.join(
          __dirname,
          "../../public/images/pembimbing",
          pembimbing.foto_pembimbing
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return Pembimbing.destroy({
        where: { id: id },
      });
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pembimbing berhasil dihapus!",
        });
      } else {
        res.send({
          message: `Tidak dapat menghapus Pembimbing dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Tidak dapat menghapus Pembimbing dengan id=" + id,
      });
    });
};
