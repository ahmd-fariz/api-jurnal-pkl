module.exports = (sequelize, Sequelize) => {
  const Siswa = sequelize.define("siswa", {
    nama_lengkap: {
      type: Sequelize.STRING,
    },
    id_alamat: {
      type: Sequelize.INTEGER,
    },
    nis: {
      type: Sequelize.STRING,
    },
    nisn: {
      type: Sequelize.STRING,
    },
    kelas: {
      type: Sequelize.STRING,
    },
    jurusan: {
      type: Sequelize.STRING,
    },
    foto_siswa: {
      type: Sequelize.STRING,
    },
    url_foto_siswa: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  // Siswa.associate = (models) => {
  //   Siswa.belongsTo(models.detailalamatsiswa, {
  //     foreignKey: "id_alamat",
  //     as: "detailalamatsiswa", 
  //   });
  // };


  // Siswa.associate = (models) => {
  //   // Relasi one-to-one dengan DetailAlamatSiswa
  //   Siswa.hasOne(models.detailalamatsiswa, {
  //     foreignKey: "id_alamat",
  //     as: "siswa",
  //   });
  // };

  return Siswa;
};
