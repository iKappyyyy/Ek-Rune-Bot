const Lobby = require("../models/Lobby");

module.exports = async user => {
    const lobby = await Lobby.findOne({
        "members.user": String(user)
    });

    return lobby;
}
