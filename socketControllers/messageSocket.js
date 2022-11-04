const Message = require("../models/messages")
const cloudinary = require("cloudinary").v2


function send_message(socket)
{
    function save_message({from, to, message, file, conversation_id}, result_file)
    {
        let value = {}

        if(file)
        {
            value = {
                message: message,
                type_file: result_file.resource_type,
                link_file: result_file.secure_url,
                from: from,
                to: to,
                conversation_id: conversation_id
            }
        }
        else
        {
            value = {
                message: message,
                from: from,
                to: to,
                conversation_id: conversation_id
            }
        }

        const saveMessage = new Message(value)

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
    }


	socket.on("sendMessage", (data) => 
	{
        const {file, token} = data

        if(file)
        {
            cloudinary.config({ 
                cloud_name : process.env.CLOUD_NAME, 
                api_key :  process.env.API_KEY, 
                api_secret : process.env.API_SECRET,
                secure : true 
            })
    
            cloudinary.uploader
            .upload(file)
            .then((result) => 
            {
                // const saveMessage = new Message({
                //     message: message,
                //     type_file: result.resource_type,
                //     link_file: result.secure_url,
                //     from: from,
                //     to: to,
                //     conversation_id: conversation_id
                // })
        
                // saveMessage.save()
                // .then(() => {
                //     Message.find({
                //         $or:
                //         [
                //             {
                //                 from: from,
                //                 to: to
                //             },
                //             {
                //                 from: to,
                //                 to: from
                //             }
                //         ]
                //     })
                //     .then((messages) => {
                //         socket.to(conversation_id).emit("receive_message", 
                //         {
                //             success: true,
                //             message: "Votre message a bien été emit",
                //             messages,
                //             conversation_id
                //         })
        
                //         socket.emit("sended_message", 
                //         {
                //             status: 201,
                //             success: true,
                //             message: "Votre message a bien été envoyé",
                //             messages,
                //             sender_id: from,
                //             conversation_id
                //         })
                //     })
                //     .catch((error) => {
                //         socket.emit("error_get_messages", 
                //         {
                //             success: 500,
                //             error
                //         })
                //     })
                // })
                // .catch((error)  => {
                //     socket.emit("error_sended_message", 
                //     {
                //         success: 500,
                //         error
                //     })
                // })
    
                save_message(data, result)
            })
        }
        else
        {
            save_message(data)
        }
	})
}


module.exports = {send_message}