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
    id_kelas: {
      type: Sequelize.INTEGER,
    },
    id_jurusan: {
      type: Sequelize.INTEGER,
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

  return Siswa;
};
