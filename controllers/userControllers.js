const User     = require("../models/user"),
      bcrypt   = require("bcrypt"),
      jwt      = require("jsonwebtoken"),
      {config} = require("../config/config")


function register(req, res, next)
{
    bcrypt.hash(req.body.password, 10)
    .then((hash) => 
    {
        const user = new User({
            name: {
                nom: req.body.nom,
                prenom: req.body.prenom
            },
            email: req.body.email,
            sexe: req.body.sexe,
            password: hash
        })

        user.save()
        .then((user) => 
        {
            res.status(201).json({
                token: "Bearer " + jwt.sign(
                    {userId: user._id},
                    config.jwt_txt_encrypt,
                    {expiresIn: "24h"}
                ),
                success: true,
                message: "Utilisateur créée avec succès",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    sexe: user.sexe,
                    avatar: user.avatar,
                    anonyme: user.anonyme
                }
            })
        })
        .catch((error) => 
        {
            res.status(500).json({
                success: false,
                message: "Quelque chose s'est mal passé",
                error
            })
        })
    })
    .catch((error) => {
        res.status(500).json({
            success: false,
            message: "Quelque chose s'est mal passé",
            error
        })
    })
}

function login(req, res, next)
{
    const email    = req.body.email

    User.findOne({email: email})
    .then((user) => 
    {
        if(!user)
        {
            res.status(401).json({
                success: false,
                message: "E-mail ou mot de passe incorrect"
            })
        }
        else
        {
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => 
            {
                if(valid)
                {
                    res.status(200).json({
                        token: "Bearer " + jwt.sign(
                            {userId: user._id},
                            config.jwt_txt_encrypt,
                            {expiresIn: "24h"}
                        ),
                        success: true,
                        message: "Vous êtes connecté",
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            sexe: user.sexe,
                            avatar: user.avatar,
                            anonyme: user.anonyme
                        }
                    })
                }
                else
                {
                    res.status(401).json({
                        success: false,
                        message: "E-mail ou mot de passe incorrect"
                    })
                }
            })
            .catch((error) => res.status(500).json({error}))
        }
    })
    .catch((error) => res.status(500).json({error}))
}

module.exports = {register, login}

