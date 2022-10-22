const Message = require("../models/messages")

function createMessage(req, res, next)
{
    const message = new Message({
        message: req.body.value,
        type_message: req.body.type,
        from: req.body.from,
        to: req.body.to
    })

    message.save()
    .then(() => {
        Message.find({
            $or:
            [
                {
                    from: req.body.from,
                    to: req.body.to
                },
                {
                    from: req.body.to,
                    to: req.body.from
                }
            ]
        })
        .then((messages) => res.status(201).json({success: true, messages}))
        .catch((error) => res.status(501).json({success: false, error}))
    })
    .catch((error)  => res.status(500).json({success: false, error}))
}


function getMessages(req, res, next)
{
    Message.find({
        $or:
        [
            {
                from: req.query.from,
                to: req.query.to
            },
            {
                from: req.query.to,
                to: req.query.from
            }
        ]
    })
    .then((messages) => res.status(200).json({success: true, messages}))
    .catch((error)   => res.status(500).json({error}))
}

function deleteAllMessages(req, res, next)
{
    Message.deleteMany()
    .then(() => res.json('deleted'))
    .catch((error) => res.json(error))
}


module.exports = {createMessage, getMessages, deleteAllMessages}