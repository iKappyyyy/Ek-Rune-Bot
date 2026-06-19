const Lobby = require("../models/Lobby");

module.exports = async (lobby, reply) => {
    
    if (!lobby.members) {
        return false;
    } else {
        for (let i = 0; i < lobby.members.length; i++) {
            if (lobby.members[i].user !== 'Reserved') return false;
        }
    }

    try {
        await reply.delete();
    } catch (error) {
        console.log(`there was an error deleting the reply. error: ${error}`);
    }

    try {
        await Lobby.deleteOne({
            lobbyId: lobby.lobbyId
        });
    } catch (error) {
        console.log(`there was an error deleting the lobby. error: ${error}`);
    }

    return true;
}
