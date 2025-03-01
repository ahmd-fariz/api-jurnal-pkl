module.exports = (app) => {
  const router = require("express").Router();
  const siswa = require("../controllers/siswaController");
  const authSiswa = require("../controllers/authSiswaController");
  const upl_fotoSiswa = require("../middleware/fotosiswa");

  router.get("/", siswa.findAll);
  router.get("/:id", siswa.findOne);
  router.post("/", upl_fotoSiswa.single("siswa_foto"), siswa.create);
  router.patch("/:id", upl_fotoSiswa.single("siswa_foto"), siswa.update);
  router.delete("/:id", siswa.delete);

  //auth nya
  router.post("/loginSiswa", authSiswa.authsiswa);
  router.post("/logout", authSiswa.logout);
  router.get("/me", authSiswa.cekToken);

  app.use("/api/siswa", router);
};
