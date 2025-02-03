module.exports = (app) => {
  const router = require("express").Router();
  const siswa = require("../controllers/siswaController");
  const upl_fotoSiswa = require("../middleware/fotosiswa");

  router.get("/", siswa.findAll);
  router.get("/:id", siswa.findOne)
  router.post("/", upl_fotoSiswa.single("siswa_foto"), siswa.create);
  router.patch("/:id", upl_fotoSiswa.single("siswa_foto"), siswa.update);
  router.delete("/:id", siswa.delete);

  app.use("/api/siswa", router);
};
