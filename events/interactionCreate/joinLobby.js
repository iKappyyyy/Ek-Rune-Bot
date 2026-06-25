const Lobby = require('../../models/Lobby');
const { MaxLobbyMembers } = require('../../enums'); 
const { MessageFlags } = require('discord.js');
const { graidCreateEmbed } = require('../../utils/embedCreator');
const getLobbyUserIsIn = require('../../utils/getLobbyUserIsIn');
const removeUserFromLobby = require('../../utils/removeUserFromLobby');
const checkForFullLobby = require('../../utils/checkForFullLobby');
const getLobbyMessage = require('../../utils/getLobbyMessage');
const getUserGuild = require('../../utils/getUserGuild');

module.exports = async (interaction, client) => {
    if (!interaction.isButton() || !interaction.customId.startsWith('join-button-')) return;

    const lobbyId = interaction.customId.replace('join-button-', '');
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    const lobby = await Lobby.findOne({ lobbyId });

    if (!lobby) {  // lobby wasn't found
        await interaction.editReply({
            content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.'
        });

        return;
    } else if (lobby.members.some(member => member.user === String(interaction.user))) { // user already in lobby
        await interaction.editReply({
            content: `Successfully left ${lobby.members[0].user}'s lobby.`
        });

        await removeUserFromLobby(lobby, interaction.user, client);
    } else if (MaxLobbyMembers <= lobby.members.length) {  // lobby is full
        await interaction.editReply({
            content: `Couldn't join because ${lobby.members[0].user}'s lobby is already full!`
        });

        return;
    } else { // user isn't in the lobby
        const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);

        if (lobbyUserIsIn) {
            await interaction.editReply({
                content: `Successfully swapped from ${lobbyUserIsIn.members[0].user}'s lobby to ${lobby.members[0].user}'s lobby!`
            });
            
            await removeUserFromLobby(lobbyUserIsIn, interaction.user, client);
        } else {
            await interaction.editReply({
                content: `You have joined ${lobby.members[0].user}'s lobby!`,
            });
        }

        const userGuild = await getUserGuild(interaction.user)
        lobby.members.push({ user: interaction.user, guild: userGuild});
        await checkForFullLobby(lobby, interaction);
    }

    if (lobby && lobby.members.some(member => member.user !== "Reserved")) {
        await lobby.save();

        const lobbyLeader = await interaction.client.users.fetch(lobby.members[0].user.replace(/[<@!>]/g, ""));

        const reply = await getLobbyMessage(lobby, client);
        await reply.edit({
            embeds: [graidCreateEmbed(lobby, lobbyLeader.displayName)]
        });
    }
}