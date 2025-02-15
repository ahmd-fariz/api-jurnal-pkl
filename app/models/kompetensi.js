const { SELECT } = require("sequelize/lib/query-types");

module.exports = (sequelize, Sequelize) => {
  const Kompetensi = sequelize.define("kompetensi", {
    id_jurusan: {
        type: Sequelize.INTEGER,
    },
    nama_pembimbing: {
      type: Sequelize.STRING,
    },
    deskripsi_kompetensi: {
      type: Sequelize.STRING,
    },
  });

  return Kompetensi;
};
