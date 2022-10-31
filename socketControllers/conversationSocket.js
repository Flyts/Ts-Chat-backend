const Conversation = require("../models/conversation")
const Message      = require("../models/messages")

function join_or_create_conversation(socket)
{
	socket.on("join_or_create_conversation", (data) => 
	{
		const {from, to, friend, token} = data

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
				.then((conversation_create) => 
				{
					socket.emit("created_conversation", 
					{
						status: 201,
						success: true,
						message: "Votre conversation a bien été créée",
						conversation: conversation_create,
						messages: [],
						friend: friend
					})

					socket.join(conversation_create._id)
				})
				.catch((error) => 
				{
					socket.emit("error_join_or_create_conversation", {error})
				})
			}
			else
			{
				Message.find({conversation_id: conversation[0]._id})
				.sort({createdAt: 1})
				.then((messages) =>
				{
					socket.emit("joined_conversation", {
						status: 200,
						success: false,
						message: "Votre conversation existe déjà",
						messages,
						conversation,
						friend: friend
					})

					socket.join((conversation[0]._id).valueOf())
				})
				.catch((error) => 
				{
					socket.emit("error_join_or_create_conversation", {error})
				})
			}
		})
		.catch((error) => res.status(500).json({error}))
	})

	socket.on("login_after_reload_page", (data) => 
	{
		const {token, conversation_id} = data

		socket.join(conversation_id)
	})
}


module.exports = {join_or_create_conversation}

