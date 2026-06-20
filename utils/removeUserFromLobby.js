const { MessageFlags } = require("discord.js");
const checkForEmptyLobby = require("./checkForEmptyLobby");
const { graidCreateEmbed } = require("./embedCreator");
const getLobbyMessage = require("./getLobbyMessage");

module.exports = async (lobby, user, client) => {
    let newMembersList = [...lobby.members];
    if (/^\d$/.test(String(user))) { // if the value is a digit
        newMembersList = lobby.members.splice(user, 1);
    } else {
        newMembersList = lobby.members.filter(member => member.user !== String(user));
    }
    
    lobby.members = newMembersList;

    await lobby.save();

    try {
        const reply = await getLobbyMessage(lobby, client);
    
        const lobbyIsEmpty = await checkForEmptyLobby(lobby, reply);

        if (lobbyIsEmpty) return;

        const lobbyLeader = await client.users.fetch(lobby.members[0].user.replace(/[<@!>]/g, ""));

        await reply.edit({
            embeds: [graidCreateEmbed(lobby, lobbyLeader.displayName)]
        });

    } catch (error) {
        console.log(`an error has occurred trying to edit the reply of a lobby | error: ${error}`);
    }


}
