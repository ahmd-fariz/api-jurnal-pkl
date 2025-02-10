module.exports = (app) => {
  const pembimbing = require("../controllers/pembimbing.controller.js");
  const router = require("express").Router();

  router.post("/", upload.single("foto"), pembimbing.create);
  router.get("/", pembimbing.findAll);
  router.get("/:id", pembimbing.findOne);
  router.put("/:id", upload.single("foto"), pembimbing.update);
  router.delete("/:id", pembimbing.delete);

  app.use("/api/pembimbing", router);
};
