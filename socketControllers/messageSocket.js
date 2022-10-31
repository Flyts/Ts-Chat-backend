const Message = require("../models/messages")


function send_message(socket)
{
	socket.on("sendMessage", (data) => 
	{
        const {from, to, message, token, conversation_id} = data

        const saveMessage = new Message({
            message: message.value,
            type_message: message.type,
            from: from,
            to: to,
            conversation_id: conversation_id
        })

        saveMessage.save()
        .then(() => {
            Message.find({
                $or:
                [
                    {
                        from: from,
                        to: to
                    },
                    {
                        from: to,
                        to: from
                    }
                ]
            })
            .then((messages) => {
                socket.to(conversation_id).emit("receive_message", 
                {
                    success: true,
                    message: "Votre message a bien été emit",
                    messages,
                    conversation_id
                })

                socket.emit("sended_message", 
                {
                    status: 201,
                    success: true,
                    message: "Votre message a bien été envoyé",
                    messages,
                    sender_id: from,
                    conversation_id
                })
            })
            .catch((error) => {
                socket.emit("error_get_messages", 
                {
                    success: 500,
                    error
                })
            })
        })
        .catch((error)  => {
            socket.emit("error_sended_message", 
            {
                success: 500,
                error
            })
        })

        // console.log(conversation_id)
	})
}


module.exports = {send_message}