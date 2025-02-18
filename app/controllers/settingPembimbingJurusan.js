const db = require("../models");
const SettingPembimbingJurusan = db.settingpembimbingjurusan;

// Create
exports.create = async (req, res) => {
  try {
    const setting = await SettingPembimbingJurusan.create({
      id_jurusan: req.body.id_jurusan,
      id_pembimbing: req.body.id_pembimbing,
    });

    res.status(201).json({
      status: "success",
      message: "Setting pembimbing jurusan berhasil ditambahkan",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error.message ||
        "Terjadi kesalahan saat menambahkan setting pembimbing jurusan",
    });
  }
};

// FindAll with relations
exports.findAll = async (req, res) => {
  try {
    const settings = await SettingPembimbingJurusan.findAll({
      include: [
        {
          model: db.jurusan,
          as: "jurusan",
          attributes: ["id", "nama_jurusan"],
        },
        {
          model: db.pembimbing,
          as: "pembimbing",
          attributes: ["id", "nama_pembimbing"],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error.message ||
        "Terjadi kesalahan saat mengambil data setting pembimbing jurusan",
    });
  }
};

// FindOne with relations
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const setting = await SettingPembimbingJurusan.findByPk(id, {
      include: [
        {
          model: db.jurusan,
          as: "jurusan",
          attributes: ["id", "nama_jurusan"],
        },
        {
          model: db.pembimbing,
          as: "pembimbing",
          attributes: ["id", "nama_pembimbing"],
        },
      ],
    });

    if (!setting) {
      return res.status(404).json({
        status: "error",
        message: "Setting pembimbing jurusan tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error.message ||
        "Terjadi kesalahan saat mengambil data setting pembimbing jurusan",
    });
  }
};

// Update
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const setting = await SettingPembimbingJurusan.findByPk(id);

    if (!setting) {
      return res.status(404).json({
        status: "error",
        message: "Setting pembimbing jurusan tidak ditemukan",
      });
    }

    await setting.update({
      id_jurusan: req.body.id_jurusan,
      id_pembimbing: req.body.id_pembimbing,
    });

    res.status(200).json({
      status: "success",
      message: "Setting pembimbing jurusan berhasil diperbarui",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error.message ||
        "Terjadi kesalahan saat memperbarui setting pembimbing jurusan",
    });
  }
};

// Delete
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const setting = await SettingPembimbingJurusan.findByPk(id);

    if (!setting) {
      return res.status(404).json({
        status: "error",
        message: "Setting pembimbing jurusan tidak ditemukan",
      });
    }

    await setting.destroy();

    res.status(200).json({
      status: "success",
      message: "Setting pembimbing jurusan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        error.message ||
        "Terjadi kesalahan saat menghapus setting pembimbing jurusan",
    });
  }
};
