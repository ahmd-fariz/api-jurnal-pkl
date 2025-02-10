const db = require("../models");
const Jurnal = db.jurnal;
const Siswa = db.siswa;
const Pembimbing = db.pembimbing;
const DetailAlamatSiswa = db.detailalamatsiswa;

// Create
exports.create = async (req, res) => {
  try {
    const jurnal = {
      tanggal_pengisian: new Date(),
      nama_pekerjaan: req.body.nama_pekerjaan,
      deskripsi_pekerjaan: req.body.deskripsi_pekerjaan,
      id_siswa: req.body.id_siswa,
      nama_perusahaan: req.body.nama_perusahaan,
      id_pembimbing: req.body.id_pembimbing,
      pembimbing_perusahaan: req.body.pembimbing_perusahaan,
    };

    console.log("Request body:", req.body); // Tambahkan ini untuk debug

    // Validasi keberadaan siswa dan pembimbing
    const siswa = await Siswa.findByPk(req.body.id_siswa);
    const pembimbing = await Pembimbing.findByPk(req.body.id_pembimbing);

    if (!siswa || !pembimbing) {
      return res.status(400).send({
        message: "ID Siswa atau ID Pembimbing tidak valid!",
      });
    }

    const data = await Jurnal.create(jurnal);
    res.send({
      message: "Jurnal berhasil dibuat.",
      data: data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi error saat membuat jurnal.",
    });
  }
};

// FindAll
exports.findAll = async (req, res) => {
  try {
    const data = await Jurnal.findAll({
      include: [
        {
          model: Siswa,
          as: "siswa",
          include: [
            {
              model: DetailAlamatSiswa,
              as: "detailAlamatSiswa",
            },
          ],
        },
        {
          model: Pembimbing,
          as: "pembimbing",
        },
      ],
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi error saat mengambil data jurnal.",
    });
  }
};

// FindOne
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Jurnal.findByPk(id, {
      include: [
        {
          model: Siswa,
          as: "siswa",
          include: [
            {
              model: DetailAlamatSiswa,
              as: "detailAlamatSiswa",
            },
          ],
        },
        {
          model: Pembimbing,
          as: "pembimbing",
        },
      ],
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Jurnal dengan id=${id} tidak ditemukan.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error mengambil jurnal dengan id=" + id,
    });
  }
};

// Update
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Validasi jika ada perubahan id_siswa atau id_pembimbing
    if (req.body.id_siswa) {
      const siswa = await Siswa.findByPk(req.body.id_siswa);
      if (!siswa) {
        return res.status(400).send({
          message: "ID Siswa tidak valid!",
        });
      }
    }

    if (req.body.id_pembimbing) {
      const pembimbing = await Pembimbing.findByPk(req.body.id_pembimbing);
      if (!pembimbing) {
        return res.status(400).send({
          message: "ID Pembimbing tidak valid!",
        });
      }
    }

    const num = await Jurnal.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      // Ambil data yang sudah diupdate dengan relasinya
      const updatedData = await Jurnal.findByPk(id, {
        include: [
          {
            model: Siswa,
            as: "siswa",
            include: [
              {
                model: DetailAlamatSiswa,
                as: "detailAlamatSiswa",
              },
            ],
          },
          {
            model: Pembimbing,
            as: "pembimbing",
          },
        ],
      });

      res.send({
        message: "Jurnal berhasil diupdate.",
        data: updatedData,
      });
    } else {
      res.send({
        message: `Tidak dapat mengupdate Jurnal dengan id=${id}. Mungkin Jurnal tidak ditemukan atau req.body kosong!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error mengupdate jurnal dengan id=" + id,
    });
  }
};

// Delete
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    // Cek apakah jurnal ada sebelum dihapus
    const jurnal = await Jurnal.findByPk(id);
    if (!jurnal) {
      return res.status(404).send({
        message: `Jurnal dengan id=${id} tidak ditemukan.`,
      });
    }

    const num = await Jurnal.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Jurnal berhasil dihapus!",
      });
    } else {
      res.send({
        message: `Tidak dapat menghapus Jurnal dengan id=${id}.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Tidak dapat menghapus jurnal dengan id=" + id,
    });
  }
};
