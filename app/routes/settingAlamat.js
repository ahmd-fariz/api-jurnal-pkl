module.exports = (app) => {
  const settingAlamat = require("../controllers/settingAlamatController");
  const router = require("express").Router();

  // Create a new SettingAlamat
  router.post("/", settingAlamat.create);

  // Retrieve all SettingAlamat
  router.get("/", settingAlamat.findAll);

  // Retrieve a single SettingAlamat with id
  router.get("/:id", settingAlamat.findOne);

  // Update a SettingAlamat with id
  router.put("/:id", settingAlamat.update);

  // Delete a SettingAlamat with id
  router.delete("/:id", settingAlamat.delete);

  app.use("/api/setting-alamat", router);
};
