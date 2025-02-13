module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("setting", {
    setting_warna: {
      type: Sequelize.STRING,
    },
    wa: {
      type: Sequelize.STRING,
    },
    telp: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    nama_sekolah: {
      type: Sequelize.TEXT,
    },
    alamat: {
      type: Sequelize.TEXT,
    },
    url_gmaps: {
      type: Sequelize.TEXT,
    },
    foto: {
      type: Sequelize.STRING,
    },
    gambar_setting: {
      type: Sequelize.STRING,
    },
  });

  return Setting;
};
