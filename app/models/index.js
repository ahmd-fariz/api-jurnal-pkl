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

// siswa ke detail alamat siswa
db.siswa.hasOne(db.detailalamatsiswa, {
  foreignKey: "id_alamat",
  as: "detail_alamat_siswas",
});

db.detailalamatsiswa.hasOne(db.siswa, {
  
})

// Paket Model
// db.paket.hasMany(db.cart_paket, { foreignKey: "id_paket", as: "cart_pakets" });
// db.cart_paket.belongsTo(db.paket, { foreignKey: "id_paket", as: "pakets" });

// // Pelanggan Model
// db.pelanggan.hasMany(db.invoice, {
//   foreignKey: "pelanggan_id",
//   as: "Invoices",
// });
// db.invoice.belongsTo(db.pelanggan, {
//   foreignKey: "pelanggan_id",
//   as: "pelanggas",
// });

// db.artikel.hasMany(db.administrators, {
//   foreignKey: "admin_id",
//   as: "Administrators",
// });

// db.administrators.belongsTo(db.artikel, {
//   foreignKey: "admin_id",
//   as: "Artikels",
// });

// Paket Model
// db.paket.belongsTo(db.kategoriwebsite, {
//   foreignKey: "kategori_website_Id",
//   as: "kategoriWebsite",
// });

// KategoriWebsite Model
// db.kategoriwebsite.hasMany(db.paket, {
//   foreignKey: "kategori_website_Id",
//   as: "Pakets",
// });

// //Klien
// db.klien.belongsTo(db.paket, {
//   foreignKey: "paket_Id",
//   as: "pakets",
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
