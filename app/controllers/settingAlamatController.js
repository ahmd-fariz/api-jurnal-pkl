const db = require("../models");
const SettingAlamat = db.settingAlamat;

// Create and Save a new SettingAlamat
exports.create = (req, res) => {
  // Validate request
  if (!req.body.alamat_lengkap) {
    res.status(400).send({
      message: "Alamat lengkap tidak boleh kosong!",
    });
    return;
  }

  // Create a SettingAlamat
  const settingAlamat = {
    provinsi: req.body.provinsi,
    kota_kabupaten: req.body.kota_kabupaten,
    kecamatan: req.body.kecamatan,
    desa: req.body.desa,
    nama_jalan: req.body.nama_jalan,
    rt: req.body.rt,
    rw: req.body.rw,
    alamat_lengkap: req.body.alamat_lengkap,
  };

  // Save SettingAlamat in the database
  SettingAlamat.create(settingAlamat)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Terjadi kesalahan saat membuat Setting Alamat.",
      });
    });
};

// Retrieve all SettingAlamat from the database
exports.findAll = (req, res) => {
  SettingAlamat.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Terjadi kesalahan saat mengambil data Setting Alamat.",
      });
    });
};

// Find a single SettingAlamat with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  SettingAlamat.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Setting Alamat dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error mengambil Setting Alamat dengan id=" + id,
      });
    });
};

// Update a SettingAlamat by the id
exports.update = (req, res) => {
  const id = req.params.id;

  SettingAlamat.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Setting Alamat berhasil diperbarui.",
        });
      } else {
        res.send({
          message: `Tidak dapat memperbarui Setting Alamat dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error memperbarui Setting Alamat dengan id=" + id,
      });
    });
};

// Delete a SettingAlamat with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  SettingAlamat.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Setting Alamat berhasil dihapus!",
        });
      } else {
        res.send({
          message: `Tidak dapat menghapus Setting Alamat dengan id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Tidak dapat menghapus Setting Alamat dengan id=" + id,
      });
    });
};
