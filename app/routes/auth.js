module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const auth = require("../controllers/authController");

  router.post("/login", auth.login);
  router.post("/loginsiswa", auth.authsiswa);
  router.post("/loginpembimbing", auth.authpembimbing);
  router.post("/logout", auth.logout);
  router.get("/cekToken", auth.cekToken);

  app.use("/api/auth", router);
};
