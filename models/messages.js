const mongoose = require("mongoose")


const messageSchema = mongoose.Schema({
    message: {
        type: String,
        default: null,
        max: 1000
    },
    type_file: {
        type: String,
        max: 6,
        default: null
    },
    link_file: {
        type: String,
        max: 50,
        default: null
    },
    from: {
        type: String,
        required: true,
        max: 20
    },
    to: {
        type: String,
        required: true,
        max: 20
    },
    deleted: {
        type: Boolean,
        default: false
    },
    is_replit: {
        type: Boolean,
        default: false
    },
    replit_at: {
        type: Object
    },
    conversation_id: {
        type: String,
        require: true,
        max: 20
    }, 
    status:{
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema)