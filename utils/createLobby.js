const { generateId } = require('./createCustomId');
const Lobby = require('../models/Lobby');
const getLobbyUserIsIn = require('./getLobbyUserIsIn');
const removeUserFromLobby = require('./removeUserFromLobby');

module.exports = async (raidType, hostGuild, lobbyAuthor, client) => {
    let lobbyId = generateId();

    while (await Lobby.exists({ lobbyId })) {
        lobbyId = generateId();
    }

    const lobbyUserIsIn = await getLobbyUserIsIn(String(lobbyAuthor));
    if (lobbyUserIsIn) {
        await removeUserFromLobby(lobbyUserIsIn, lobbyAuthor, client);
    }

    const lobby = new Lobby({
        raidType,
        hostGuild,
        lobbyId,
        members: [lobbyAuthor]
    });

    await lobby.save();

    return lobby;
};
