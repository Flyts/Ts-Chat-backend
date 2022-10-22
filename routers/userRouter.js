const express = require("express"),
      router  = express.Router(),
      userController = require("../controllers/userControllers")
      
router.post("/register", userController.register)
router.post("/login",    userController.login)

module.exports = router