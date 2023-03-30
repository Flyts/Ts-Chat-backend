const User = require("../models/user")

function emit_user_info(socket)
{
    socket.on("emitMyNewInfoForAllUser", ({userId}) => 
    {
        User.findOne({_id: userId})
        .then((user) => {
            socket.broadcast.emit("emit_my_new_info_for_all_user", 
            {
                user
            })
        })
        .catch((erros) => {
            socket.emit("error_find_user", 
            {
                success: 500,
                error
            })
        })
    })
}

module.exports = {emit_user_info}