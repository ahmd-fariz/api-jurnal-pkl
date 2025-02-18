module.exports = (app) => {
    const SettingPembimbingJurusan = require("../controllers/settingPembimbingJurusan.js");
    const router = require("express").Router();
  
    // Create a new SettingPembimbingJurusan
    router.post("/", SettingPembimbingJurusan.create);
  
    // Retrieve all SettingPembimbingJurusan
    router.get("/", SettingPembimbingJurusan.findAll);
  
    // Retrieve a single SettingPembimbingJurusan with id
    router.get("/:id", SettingPembimbingJurusan.findOne);
  
    // Update a SettingPembimbingJurusan with id
    router.patch("/:id", SettingPembimbingJurusan.update);
  
    // Delete a SettingPembimbingJurusan with id
    router.delete("/:id", SettingPembimbingJurusan.delete);
  
    app.use("/api/setting-pembimbing-jurusan", router);
  };
  