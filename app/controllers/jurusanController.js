const db = require("../models");
const Jurusan = db.jurusan;

// Create and Save a new Jurusan
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nama_jurusan) {
    res.status(400).send({
      message: "Nama jurusan tidak boleh kosong!",
    });
    return;
  }

  // Create a Jurusan
  const jurusan = {
    nama_jurusan: req.body.nama_jurusan,
    deskripsi_jurusan: req.body.deskripsi_jurusan,
  };

  // Save Jurusan in the database
  Jurusan.create(jurusan)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat data jurusan.",
      });
    });
};

// Retrieve all Jurusan from the database
exports.findAll = (req, res) => {
  Jurusan.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Terjadi kesalahan saat mengambil data jurusan.",
      });
    });
};

// Find a single Jurusan with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Jurusan.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Jurusan dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error mengambil Jurusan dengan id=" + id,
      });
    });
};

// Update a Jurusan by the id
exports.update = (req, res) => {
  const id = req.params.id;

  Jurusan.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Jurusan berhasil diperbarui.",
        });
      } else {
        res.send({
          message: `Tidak dapat memperbarui Jurusan dengan id=${id}. Mungkin Jurusan tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error memperbarui Jurusan dengan id=" + id,
      });
    });
};

// Delete a Jurusan with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Jurusan.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Jurusan berhasil dihapus!",
        });
      } else {
        res.send({
          message: `Tidak dapat menghapus Jurusan dengan id=${id}. Mungkin Jurusan tidak ditemukan!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Tidak dapat menghapus Jurusan dengan id=" + id,
      });
    });
};
