module.exports = (app) => {
    const router = require("express").Router();
    const kelas = require("../controllers/kelasController");
  
    router.get("/", kelas.findAll);
    router.get("/:id", kelas.findOne);
    router.post("/", kelas.create);
    router.patch("/:id", kelas.update);
    router.delete("/:id", kelas.delete);
  
    app.use("/api/kelas", router);
  };
  