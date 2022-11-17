const { findOneAndUpdate } = require("../models/user")
const User     = require("../models/user"),
      bcrypt   = require("bcrypt"),
      jwt      = require("jsonwebtoken"),
      {config} = require("../config/config"),
      { validationResult } = require('express-validator');

const cloudinary = require("cloudinary").v2


function register(req, res, next)
{
    bcrypt.hash(req.body.password, 10)
    .then((hash) => 
    {
        const avatar = 
            (req.body.sexe).toLowerCase() === "femme" ?
                "https://res.cloudinary.com/drctiml18/image/upload/v1667578298/femme_kk4ucd.jpg"
            : undefined 

        const user = new User({
            nom: (req.body.nom).toLowerCase(),
            prenom: (req.body.prenom).toLowerCase(),
            email: (req.body.email).toLowerCase(),
            sexe: (req.body.sexe).toLowerCase(),
            password: hash,
            avatar: avatar
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
    const email    = (req.body.email).toLowerCase()

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
                            _id: user._id,
                            nom: user.nom,
                            prenom: user.prenom,
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

function getSearchFriend(req, res, next)
{
    const search = (req.query.search).toLowerCase(),
          id     = req.query.id
    
    User.find({
        $or:[
            {
                $and:[
                    {nom: { $regex: '.*' + search + '.*' }},
                    {_id: {$ne: id}}
                ]
            },
            {
                $and:[
                    {prenom: { $regex: '.*' + search + '.*' }},
                    {_id: {$ne: id}}
                ]
            },
        ]
    })
    .then((users) => res.status(200).json({
        success: true,
        message: 
            users.length 
            ? 
                `${users.length} utilisateur(s) trouvé(s) correspondant à votre recherche`
            : 
                `Aucun utilisateur trouvé correspondant à votre recherche`,
        users
    }))
    .catch((errors) => res.status(500).json({errors}))
}

function editAccountImg(req, res, next)
{
    const {photo, id} = req.body

    if(photo)
    {
        cloudinary.config({ 
            cloud_name : process.env.CLOUD_NAME, 
            api_key :  process.env.API_KEY, 
            api_secret : process.env.API_SECRET,
            secure : true 
        })
        
        cloudinary.uploader
        .upload(photo)
        .then((result) => 
        {
            User.findOneAndUpdate({_id: id}, {avatar: result.secure_url}, {returnOriginal: false})
            .then((user) => 
            {
                if(user)
                {
                    res.status(201).json({
                        success: true, 
                        message: "Votre photo a bien été modifiée", 
                        user
                    })
                }
            })
            .catch((errors) => res.status(500).json({success: false, errors, message: "Error update user avatar in database"}))
        })
        .catch((errors) => res.status(500).json({success: false, errors, message: "Error save to cloudinary"}))
    }
    else
    {
        res.status(500).json({success: false, message: "Vous devez selectioner une image"})
    }
}

function editAccountInfo(req, res, next)
{ 
    const errors = validationResult(req)
    if (!errors.isEmpty()) 
    {
      return res.status(400).json({ errors: errors.array() })
    }

    const {id, nom, prenom, description} = req.body

    User.findOneAndUpdate({_id: id}, 
    {
        nom: nom,
        prenom: prenom,
        desciption: description
    }, 
    {returnOriginal: false})
    .then((user) => {
        res.status(200).json({
            success: true, 
            message: "Vos informations ont bien été mis à jour", 
            user
        })
    })
    .catch((errors) => res.status(500).json({success: false, errors, message: "Error save to database"}))
}

module.exports = {register, login, getSearchFriend, editAccountImg, editAccountInfo}

