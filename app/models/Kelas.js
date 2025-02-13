module.exports = (sequelize, Sequelize) => {
  const Kelas = sequelize.define("kelas", {
    nama_kelas: {
      type: Sequelize.STRING,
    },
    wali_kelas: {
      type: Sequelize.STRING,
    },
  });

  return Kelas;
};
