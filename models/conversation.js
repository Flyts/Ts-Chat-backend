const mongoose = require("mongoose")


const conversationSchema = mongoose.Schema({
    conversation: {
        type: Object,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Conversation", conversationSchema)