const { generateId } = require('./createCustomId');
const Lobby = require('../models/Lobby');
const getLobbyUserIsIn = require('./getLobbyUserIsIn');
const removeUserFromLobby = require('./removeUserFromLobby');
const getUserGuild = require('./getUserGuild');

module.exports = async (raidType, lobbyAuthor, client) => {
    let lobbyId = generateId();

    while (await Lobby.exists({ lobbyId })) {
        lobbyId = generateId();
    }

    const lobbyUserIsIn = await getLobbyUserIsIn(String(lobbyAuthor));
    if (lobbyUserIsIn) {
        await removeUserFromLobby(lobbyUserIsIn, lobbyAuthor, client);
    }

    const userGuild = await getUserGuild(lobbyAuthor);

    const lobby = new Lobby({
        raidType,
        lobbyId,
        members: [{ user: lobbyAuthor, guild: userGuild }]
    });

    await lobby.save();

    return lobby;
};
