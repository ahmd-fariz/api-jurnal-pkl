module.exports = (app) => {
  const perusahaan = require("../controllers/perusahaanController.js");
  const router = require("express").Router();

  router.post("/", perusahaan.create);
  router.get("/", perusahaan.findAll);
  router.get("/:id", perusahaan.findOne);
  router.patch("/:id", perusahaan.update);
  router.delete("/:id", perusahaan.delete);

  app.use("/api/perusahaan", router);
};
