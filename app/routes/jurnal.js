module.exports = (app) => {
  const router = require("express").Router();
  const jurnal = require("../controllers/jurnalController");

  router.get("/", jurnal.findAll);
  router.get("/:id", jurnal.findOne);
  router.post("/", jurnal.create);
  router.patch("/:id", jurnal.update);
  router.delete("/:id", jurnal.delete);

  app.use("/api/jurnal", router);
};
