module.exports = (sequelize, Sequelize) => {
  const Pembimbing = sequelize.define("pembimbing", {
    nip: {
      type: Sequelize.TEXT,
    },
    nama_pembimbing: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    foto_pembimbing: {
      type: Sequelize.STRING,
    },
    url_foto_pembimbing: {
      type: Sequelize.STRING,
    },
  });

  return Pembimbing;
};
