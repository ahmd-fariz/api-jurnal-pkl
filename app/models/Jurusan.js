module.exports = (sequelize, Sequelize) => {
  const Jurusan = sequelize.define("Jurusan", {
    nama_jurusan: {
      type: Sequelize.STRING,
    },
    deskripsi_jurusan: {
      type: Sequelize.STRING,
    },
  });

  return Jurusan;
};
