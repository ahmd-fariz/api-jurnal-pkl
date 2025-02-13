const db = require("../models");
const Kelas = db.kelas;

// Create and Save a new Kelas
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nama_kelas) {
    res.status(400).send({
      message: "Nama kelas tidak boleh kosong!",
    });
    return;
  }

  // Create a Kelas
  const kelas = {
    nama_kelas: req.body.nama_kelas,
  };

  // Save Kelas in the database
  Kelas.create(kelas)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat membuat data kelas.",
      });
    });
};

// Retrieve all Kelas from the database
exports.findAll = (req, res) => {
  Kelas.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil data kelas.",
      });
    });
};

// Find a single Kelas with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Kelas.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Kelas dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error mengambil Kelas dengan id=" + id,
      });
    });
};

// Update a Kelas by the id
exports.update = (req, res) => {
  const id = req.params.id;

  Kelas.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Kelas berhasil diperbarui.",
        });
      } else {
        res.send({
          message: `Tidak dapat memperbarui Kelas dengan id=${id}. Mungkin Kelas tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error memperbarui Kelas dengan id=" + id,
      });
    });
};

// Delete a Kelas with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Kelas.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Kelas berhasil dihapus!",
        });
      } else {
        res.send({
          message: `Tidak dapat menghapus Kelas dengan id=${id}. Mungkin Kelas tidak ditemukan!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Tidak dapat menghapus Kelas dengan id=" + id,
      });
    });
};
