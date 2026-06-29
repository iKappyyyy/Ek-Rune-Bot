const { MessageFlags } = require("discord.js");
const checkForEmptyLobby = require("./checkForEmptyLobby");
const { graidCreateEmbed } = require("./embedCreator");
const getLobbyMessage = require("./getLobbyMessage");
const getReadyMessage = require("./getReadyMessage");

module.exports = async (lobby, user, client) => {
    user = String(user);
    let newMembersList = [...lobby.members];
    if (Number.isInteger(Number(user))) { // if the value is a digit
        newMembersList = lobby.members.filter((_, i) => i !== Number(user));
    } else {
        newMembersList = lobby.members.filter(member => member.user !== user);
        delete lobby.blacklist.get(user);
    }

    lobby.members = newMembersList;

    await lobby.save();

    const reply = await getLobbyMessage(lobby, client);

    if (!reply) { // ghost lobby
        await lobby.deleteOne();
        return;
    }

    const readyMessage = await getReadyMessage(lobby, client);
    const lobbyIsEmpty = await checkForEmptyLobby(lobby, reply, readyMessage);

    if (lobbyIsEmpty) return;

    const lobbyLeader = await client.users.fetch(lobby.members[0].user.replace(/[<@!>]/g, ""));

    await reply.edit({
        embeds: [graidCreateEmbed(lobby, lobbyLeader.displayName)]
    });
}
