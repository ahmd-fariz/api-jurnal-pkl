module.exports = (sequelize, Sequelize) => {
  const Perusahaan = sequelize.define("Perusahaan", {
    nama_perusahaan: {
      type: Sequelize.STRING,
    },
    bidang_perusahaan: {
      type: Sequelize.STRING,
    },
    alamat_perusahaan: {
      type: Sequelize.STRING,
    },
    pembimbing_perusahaan: {
      type: Sequelize.STRING,
    },
  });

  return Perusahaan;
};
