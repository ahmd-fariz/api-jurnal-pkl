const db = require("../models");
const Pembimbing = db.pembimbing;
const fs = require("fs");
const path = require("path");

// Create and Save a new Pembimbing
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nip || !req.body.nama_pembimbing) {
    res.status(400).send({
      message: "NIP dan nama pembimbing tidak boleh kosong!",
    });
    return;
  }

  let foto_pembimbing = null;
  let url_foto_pembimbing = null;

  if (req.file) {
    foto_pembimbing = req.file.filename;
    url_foto_pembimbing = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }

  // Create a Pembimbing
  const pembimbing = {
    nip: req.body.nip,
    nama_pembimbing: req.body.nama_pembimbing,
    email: req.body.email,
    password: req.body.password,
    foto_pembimbing: foto_pembimbing,
    url_foto_pembimbing: url_foto_pembimbing,
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
exports.update = (req, res) => {
  const id = req.params.id;

  Pembimbing.findByPk(id)
    .then((pembimbing) => {
      if (!pembimbing) {
        return res.status(404).send({
          message: `Pembimbing dengan id=${id} tidak ditemukan.`,
        });
      }

      let updateData = {
        nip: req.body.nip,
        nama_pembimbing: req.body.nama_pembimbing,
        email: req.body.email,
      };

      // Jika ada password baru
      if (req.body.password) {
        updateData.password = req.body.password;
      }

      // Jika ada file foto baru
      if (req.file) {
        // Hapus foto lama jika ada
        if (pembimbing.foto_pembimbing) {
          const oldFilePath = path.join(
            __dirname,
            "../../public/images/pembimbing",
            pembimbing.foto_pembimbing
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        updateData.foto_pembimbing = req.file.filename;
        updateData.url_foto_pembimbing = `${req.protocol}://${req.get(
          "host"
        )}/images/${req.file.filename}`;
      } else if (req.body.remove_foto) {
        // Jika user ingin menghapus foto
        if (pembimbing.foto_pembimbing) {
          const oldFilePath = path.join(
            __dirname,
            "../../public/images/pembimbing",
            pembimbing.foto_pembimbing
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.foto_pembimbing = null;
        updateData.url_foto_pembimbing = null;
      }

      return Pembimbing.update(updateData, {
        where: { id: id },
      });
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pembimbing berhasil diupdate.",
        });
      } else {
        res.send({
          message: `Tidak dapat mengupdate Pembimbing dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error mengupdate Pembimbing dengan id=" + id,
      });
    });
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
