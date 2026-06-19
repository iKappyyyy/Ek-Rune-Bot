const { MessageFlags } = require("discord.js");
const checkForEmptyLobby = require("./checkForEmptyLobby");
const { graidCreateEmbed } = require("./embedCreator");
const getLobbyMessage = require("./getLobbyMessage");

module.exports = async (lobby, user, client) => {
    const newMembersList = lobby.members.filter(member => member.user !== String(user));
    lobby.members = newMembersList;

    await lobby.save();

    try {
        const reply = await getLobbyMessage(lobby, client);
    
        await reply.edit({
            embeds: [graidCreateEmbed(lobby)]
        });

        await checkForEmptyLobby(lobby, reply);
    } catch (error) {
        console.log(`an error has occurred trying to edit the reply of a lobby | error: ${error}`);
    }


}
