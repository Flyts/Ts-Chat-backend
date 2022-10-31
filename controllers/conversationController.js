const Conversation = require("../models/conversation"),
      Message      = require("../models/messages")

function createConversation(req, res, next)
{
    const {from, to} = req.body

    Conversation.find({
        $or:
        [
            {
                conversation:
                {
                    from: from,
                    to: to
                }
            },
            {
                conversation:
                {
                    from: to,
                    to: from
                }
            }
        ]
    })
    .then((conversation) => {
        if(!conversation.length)
        {
            const conversation = new Conversation({
                conversation: {
                    from: from,
                    to: to
                }
            })

            conversation.save()
            .then((conversation_create) => res.status(201).json({
                success: true,
                message: "Votre conversation a bien été créée",
                conversation: conversation_create
            }))
            .catch((error) => res.status(500).json({error}))
        }
        else
        {
            Message.find({conversation_id: conversation._id})
            .then((messages) =>
            {
                res.status(200).json({
                    success: false,
                    message: "Votre conversation existe déjà",
                    messages,
                    conversation
                })
            })
            .catch((error) => res.status(500).json({error}))
        }
    })
    .catch((error) => res.status(500).json({error}))
} 

module.exports = {createConversation}