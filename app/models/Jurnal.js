module.exports = (sequelize, Sequelize) => {
  const Jurnal = sequelize.define("jurnal", {
    tanggal_pengisian: {
      type: Sequelize.DATE,
    },
    nama_pekerjaan: {
      type: Sequelize.STRING,
    },
    deskripsi_pekerjaan: {
      type: Sequelize.TEXT,
    },
    id_siswa: {
      type: Sequelize.INTEGER,
    },
    id_pembimbing: {
      type: Sequelize.INTEGER,
    },
    id_perusahaan: {
      type: Sequelize.INTEGER,
    },
  });

  return Jurnal;
};
