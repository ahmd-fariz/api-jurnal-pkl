module.exports = (app) => {
  const router = require("express").Router();
  const siswa = require("../controllers/siswaController");
  const upl_fotoSiswa = require("../middleware/fotosiswa");

  router.get("/", siswa.findAll);
  router.post("/", upl_fotoSiswa.array("foto"), siswa.create);

  app.use("/api/siswa", router);
};
