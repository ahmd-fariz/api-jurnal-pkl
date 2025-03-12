module.exports = (app) => {
  const pembimbing = require("../controllers/pembimbingController.js");
  const router = require("express").Router();
  const upl_fotopembimbing = require("../middleware/pembimbing.js");

  router.post("/", upl_fotopembimbing.single("foto_pembimbing"), pembimbing.create);
  router.get("/", pembimbing.findAll);
  router.get("/:id", pembimbing.findOne);
  router.patch("/:id", upl_fotopembimbing.single("foto_pembimbing"), pembimbing.update);
  router.delete("/:id", pembimbing.delete);

  app.use("/api/pembimbing", router);
};
