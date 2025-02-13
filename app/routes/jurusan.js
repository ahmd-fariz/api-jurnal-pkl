module.exports = (app) => {
    const router = require("express").Router();
    const jurusan = require("../controllers/jurusanController");
  
    router.get("/", jurusan.findAll);
    router.get("/:id", jurusan.findOne);
    router.post("/", jurusan.create);
    router.patch("/:id", jurusan.update);
    router.delete("/:id", jurusan.delete);
  
    app.use("/api/jurusan", router);
  };
  