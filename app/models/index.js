// models/index.js

const dbConfig = require("../configs/database.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model yang dibutuhkan
db.setting = require("./Setting.js")(sequelize, Sequelize);
db.administrators = require("./Administrators.js")(sequelize, Sequelize);
db.siswa = require("./Siswa.js")(sequelize, Sequelize);
db.detailalamatsiswa = require("./detailAlamatSiswa.js")(sequelize, Sequelize);

// **Relasi antara `Siswa` dan `DetailAlamatSiswa`**
db.detailalamatsiswa.hasOne(db.siswa, {
  foreignKey: "id_alamat",
  as: "siswas", // Alias yang unik
});

db.siswa.belongsTo(db.detailalamatsiswa, {
  foreignKey: "id_alamat",
  as: "detailAlamatSiswa",
});

// **Panggil method associate jika ada**
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// siswa ke detail alamat siswa
// db.siswa.hasOne(db.detailalamatsiswa, {
//   foreignKey: "id_alamat",
//   as: "detail_alamat_siswas",
// });

// db.detailalamatsiswa.hasOne(db.siswa, {
//   foreignKey: "id_alamat",
//   as: "siswas",
// });

// Call associate methods
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sinkronkan model dengan database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

module.exports = db;
