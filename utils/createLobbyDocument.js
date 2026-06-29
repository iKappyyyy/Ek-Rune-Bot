const Lobby = require('../models/Lobby');
const getLobbyUserIsIn = require('./getLobbyUserIsIn');
const removeUserFromLobby = require('./removeUserFromLobby');
const getUserGuild = require('./getUserGuild');
const getUserBlacklist = require('./getUserBlacklist');

module.exports = async (lobbyId, lobbyAuthor, client) => {
    const lobbyUserIsIn = await getLobbyUserIsIn(String(lobbyAuthor));
    if (lobbyUserIsIn) {
        await removeUserFromLobby(lobbyUserIsIn, lobbyAuthor, client);
    }

    const userGuild = await getUserGuild(lobbyAuthor);
    const lobbyAuthorId = String(lobbyAuthor.id);
    const blacklist = await getUserBlacklist(lobbyAuthorId);

    const lobby = new Lobby({
        lobbyId,
        members: [{ user: lobbyAuthor, guild: userGuild }],
        blacklist: { [String(lobbyAuthor.id)]: blacklist }
    });

    await lobby.save();

    return lobby;
};
