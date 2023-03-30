const express = require("express"),
      router  = express.Router(),
      userController = require("../controllers/userControllers"),
      User = require("../models/user"),
      { check, body } = require('express-validator')
      
router.post("/register", 
    body("nom")
    .trim()
    .isLength({ min: 3 })
    .withMessage((value, param) => `${param.path} doit comporter au moins 3 caractères`),

    body("prenom")
    .trim()
    .isLength({ min: 3 })
    .withMessage((value, param) => `${param.path} doit comporter au moins 3 caractères`),

    body("email")
    .trim()
    .isEmail()
    .withMessage((value, param) => `${param.path} invalide`),
    
    check("email").custom(value => {
      return User.findOne({email: value}).then((user) => 
      {
        if(user) 
        {
          return Promise.reject("Email déjà utilisé")
        }
      })
    }),

    body("sexe")
    .trim()
    .isIn(["homme", "femme", "Homme", "Femme"])
    .withMessage((value, param) => `${param.path} doit être un homme ou une femme`),

    body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage((value, param) => `${param.path} doit comporter au moins 8 caractères`)
    .matches(/\d/)
    .withMessage((value, param) => `${param.path} doit contenir un nombre`),

    check("confirm_password")
    .trim()
    .custom((value, {req}) => 
    {
      if(value !== req.body.password) 
      {
        return Promise.reject("La confirmation du mot de passe est incorrecte")
      }

      return true
    }),
    // .withMessage((value, param) => `${param.path} ne doit pas être vide`),
userController.register)

router.post("/login", 
    body("email")
    .isEmail()
    .withMessage((value, param) => `${param.path} invalide`),

    body("password")
    .isLength({ min: 5 })
    .withMessage((value, param) => `${param.path} doit comporter au moins 5 caractères`),
userController.login)

router.get("/friend",    userController.getSearchFriend)
router.post("/edit-my-account-photo", userController.editAccountImg)

router.post("/edit-my-account-info", 
    check(["nom", "prenom", "description"])
    .isLength({min: 3})
    .withMessage((value, param) => `${param.path} doit comporter au moins 3 caractères`), 
userController.editAccountInfo)

module.exports = router