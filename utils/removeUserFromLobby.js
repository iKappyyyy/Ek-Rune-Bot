const { MessageFlags } = require("discord.js");
const checkForEmptyLobby = require("./checkForEmptyLobby");
const { graidCreateEmbed } = require("./embedCreator");

module.exports = async (lobby, user, client) => {
    const newMembersList = lobby.members.filter(member => member !== String(user));
    lobby.members = newMembersList;

    await lobby.save();

    try {
        const channel = await client.channels.fetch(lobby.channelId);
        const reply = await channel.messages.fetch(lobby.messageId);
    
        await reply.edit({
            embeds: [graidCreateEmbed(lobby)]
        });
        
        await checkForEmptyLobby(lobby, reply);
    } catch (error) {
        console.log(`an error has occurred trying to edit the reply of a lobby | error: ${error}`);
    }


}
