const db = require("../models");
const Perusahaan = db.perusahaan;

// Create and Save a new Perusahaan
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nama_perusahaan) {
        res.status(400).send({
            message: "Nama perusahaan tidak boleh kosong!",
        });
        return;
    }

    // Create a Perusahaan
    const perusahaan = {
        nama_perusahaan: req.body.nama_perusahaan,
        bidang_perusahaan: req.body.bidang_perusahaan,
        alamat_perusahaan: req.body.alamat_perusahaan,
        pembimbing_perusahaan: req.body.pembimbing_perusahaan,
    };

    // Save Perusahaan in the database
    Perusahaan.create(perusahaan)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Terjadi kesalahan saat membuat data perusahaan.",
            });
        });
};

// Retrieve all Perusahaan from the database
exports.findAll = (req, res) => {
    Perusahaan.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Terjadi kesalahan saat mengambil data perusahaan.",
            });
        });
};

// Find a single Perusahaan with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Perusahaan.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Tidak dapat menemukan Perusahaan dengan id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error mengambil Perusahaan dengan id=" + id,
            });
        });
};

// Update a Perusahaan by the id
exports.update = (req, res) => {
    const id = req.params.id;

    Perusahaan.update(req.body, {
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Perusahaan berhasil diperbarui.",
                });
            } else {
                res.send({
                    message: `Tidak dapat memperbarui Perusahaan dengan id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error memperbarui Perusahaan dengan id=" + id,
            });
        });
};

// Delete a Perusahaan with the specified id
exports.delete = (req, res) => {
    const id = req.params.id;

    Perusahaan.destroy({
            where: { id: id },
        })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Perusahaan berhasil dihapus!",
                });
            } else {
                res.send({
                    message: `Tidak dapat menghapus Perusahaan dengan id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Tidak dapat menghapus Perusahaan dengan id=" + id,
            });
        });
};