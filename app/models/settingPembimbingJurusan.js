module.exports = (sequelize, Sequelize) => {
  const settingPembimbingJurusan = sequelize.define(
    "setting_pembimbing_jurusan",
    {
      id_jurusan: {
        type: Sequelize.INTEGER,
      },
      id_pembimbing: {
        type: Sequelize.INTEGER,
      },
    }
  );

  return settingPembimbingJurusan;
};
