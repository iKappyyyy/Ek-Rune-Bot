const Lobby = require("../models/Lobby");

module.exports = async (lobby, message, readyMessage) => {
    
    if (!lobby.members) {
        return false;
    } else {
        for (let i = 0; i < lobby.members.length; i++) {
            if (lobby.members[i].user !== 'Reserved') return false;
        }
    }

    try {
        await message.delete();

        if (readyMessage) {
            await readyMessage.delete();
        }
    } catch (error) {
        console.log(`there was an error deleting the message. error: ${error}`);
    }

    try {
        await lobby.deleteOne();
    } catch (error) {
        console.log(`there was an error deleting the lobby. error: ${error}`);
    }

    return true;
}
