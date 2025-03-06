module.exports = (app) => {
  const router = require("express").Router();
  const authpembimbing = require("../controllers/authPembimbingController");
  const verifyToken = require("../middleware/authPembimbing");

  router.post("/loginPembimbing", authpembimbing.authpembimbing);
  router.post("/logout", authpembimbing.logout);
  router.get("/me", authpembimbing.cekToken);

  app.use("/api/authpembimbing", router);
};
