module.exports = (sequelize, Sequelize) => {
    const SettingAlamat = sequelize.define("setting_alamat", {
      provinsi: {
        type: Sequelize.STRING,
      },
      kota_kabupaten: {
        type: Sequelize.STRING,
      },
      kecamatan: {
        type: Sequelize.STRING,
      },
      desa: {
        type: Sequelize.STRING,
      },
      dusun: {
        type: Sequelize.STRING,
      },
      kelurahan: {
        type: Sequelize.STRING,
      },
      nama_jalan: {
        type: Sequelize.STRING,
      },
      rt: {
        type: Sequelize.STRING,
      },
      rw: {
        type: Sequelize.STRING,
      },
      alamat_lengkap: {
        type: Sequelize.STRING,
      },
    });
  
    return SettingAlamat;
  };
  