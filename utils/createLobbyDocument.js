const Lobby = require('../models/Lobby');
const getLobbyUserIsIn = require('./getLobbyUserIsIn');
const removeUserFromLobby = require('./removeUserFromLobby');
const getUserGuild = require('./getUserGuild');

module.exports = async (lobbyId, lobbyAuthor, client) => {
    const lobbyUserIsIn = await getLobbyUserIsIn(String(lobbyAuthor));
    if (lobbyUserIsIn) {
        await removeUserFromLobby(lobbyUserIsIn, lobbyAuthor, client);
    }

    const userGuild = await getUserGuild(lobbyAuthor);

    const lobby = new Lobby({
        lobbyId,
        members: [{ user: lobbyAuthor, guild: userGuild }]
    });

    await lobby.save();

    return lobby;
};
