const mongoose = require("mongoose"),
      uniqueValidator = require("mongoose-unique-validator")
      

const userSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true,
        max: 50
    },
    prenom: {
        type: String,
        required: true,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 150
    },
    telephone: {
        type: String,
        max: 10
    },
    sexe: {
        type: String,
        required: true,
        max: 6
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/drctiml18/image/upload/v1667578298/homme_ndj2hu.jpg",
        max: 250
    },
    anonyme: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    desciption: {
        type: String,
        default: "Salut! je viens de m'inscrire sur Ts Chat.",
        max: 400
    },
    password: {
        type: String,
        required: true,
        max: 250
    }
}) 

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)