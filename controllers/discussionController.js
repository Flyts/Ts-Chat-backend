const User = require("../models/user")

function getFriends(req, res, next)
{
    User.find({_id: {$ne: req.params.id}})
    .then((users) => res.status(200).json({users}))
    .catch((error) => res.status(500).json({error}))
}


module.exports = { getFriends }