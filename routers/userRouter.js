const express = require("express"),
      router  = express.Router(),
      userController = require("../controllers/userControllers"),
      { check } = require('express-validator');
      
router.post("/register", userController.register)
router.post("/login",    userController.login)
router.get("/friend",    userController.getSearchFriend)
router.post("/edit-my-account-photo", userController.editAccountImg)

router.post("/edit-my-account-info", 
    check(["nom", "prenom", "description"])
    .isLength({min: 3})
    .withMessage((value, param) => `${param.path} doit comporter au moins 3 caractères`), 
userController.editAccountInfo)

module.exports = router