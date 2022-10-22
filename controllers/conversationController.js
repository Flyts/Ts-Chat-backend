const Conversation = require("../models/conversation")

function createConversation(req, res, next)
{
    const {from, to} = req.body

    const conversation = new Conversation({
        conversation: {
            from: from,
            to: to
        }
    })

    conversation.save()
    .then((conversation) => res.status(201).json({
        success: true,
        message: "Votre conversation a bien été créée",
        conversation
    }))
    .catch((error) => res.status(500).json({error}))
} 

module.exports = {createConversation}