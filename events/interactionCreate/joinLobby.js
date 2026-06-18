const Lobby = require('../../models/Lobby');
const { MaxLobbyMembers } = require('../../enums'); 
const { MessageFlags } = require('discord.js');
const { graidCreateEmbed } = require('../../utils/embedCreator');
const getLobbyUserIsIn = require('../../utils/getLobbyUserIsIn');
const removeUserFromLobby = require('../../utils/removeUserFromLobby');
const checkForFullLobby = require('../../utils/checkForFullLobby');

module.exports = async (interaction, client) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('join-button-')) {
        const lobbyId = interaction.customId.replace('join-button-', '');
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        let lobby = await Lobby.findOne({ lobbyId });

        if (!lobby) {  // lobby wasn't found
            await interaction.editReply({
                content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.'
            });

            return;
        } else if (MaxLobbyMembers <= lobby.members.length) {  // lobby is full
            await interaction.editReply({
                content: `Couldn't join because ${lobby.hostGuild}'s ${lobby.raidType} lobby is already full!`
            });

            return;
        } else if (lobby.members.includes(String(interaction.user))) { // user already in lobby
            await interaction.editReply({
                content: `Successfully left ${lobby.hostGuild}'s ${lobby.raidType} lobby.`
            });

            await removeUserFromLobby(lobby, interaction.user, client);
        } else { // user isn't in the lobby
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);

            if (lobbyUserIsIn) {
                await removeUserFromLobby(lobbyUserIsIn, interaction.user, client);

                await interaction.editReply({
                    content: `Successfully swapped from ${lobbyUserIsIn.hostGuild}'s ${lobbyUserIsIn.raidType} lobby to ${lobby.hostGuild}'s ${lobby.raidType} lobby!`
                });
            } else {
                await interaction.editReply({
                    content: `You have joined ${lobby.hostGuild}'s ${lobby.raidType} lobby!`,
                });
            }
    
            lobby.members.push(interaction.user);
            await checkForFullLobby(lobby, interaction);
        }

        if (lobby && lobby.members.length !== 0) {
            await lobby.save();

            const channel = await client.channels.fetch(lobby.channelId);
            const reply = await channel.messages.fetch(lobby.messageId);
            await reply.edit({
                embeds: [graidCreateEmbed(lobby)]
            });
        }
    }
}