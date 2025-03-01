module.exports = (app) => {
  const router = require("express").Router();
  const authSiswa = require("../controllers/authSiswaController");
  const verifyToken = require("../middleware/authSiswa");

  router.post("/loginSiswa", authSiswa.authsiswa);
  router.post("/logout", authSiswa.logout);
  router.get("/me", authSiswa.cekToken);

  app.use("/api/authsiswa", router);
};
