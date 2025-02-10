module.exports = (app) => {
  const pembimbing = require("../controllers/pembimbingController.js");
  const router = require("express").Router();
  const upl_fotopembimbing = require("../middleware/fotosiswa");

  router.post("/", upl_fotopembimbing.single("foto"), pembimbing.create);
  router.get("/", pembimbing.findAll);
  router.get("/:id", pembimbing.findOne);
  router.put("/:id", upl_fotopembimbing.single("foto"), pembimbing.update);
  router.delete("/:id", pembimbing.delete);

  app.use("/api/pembimbing", router);
};
