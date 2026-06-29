const Lobby = require('../../models/Lobby');
const checkForFullLobby = require('../../utils/checkForFullLobby');
const { graidCreateEmbed } = require('../../utils/embedCreator');
const getButtonRow = require('../../utils/getButtonRow');
const getLobbyMessage = require('../../utils/getLobbyMessage');
const userIsLobbyLeader = require('../../utils/userIsLobbyLeader');
const { MessageFlags } = require('discord.js');

module.exports = async (interaction, client) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('reserve-button-')) return;

  const lobbyId = interaction.customId.replace('reserve-button-', '');
  const lobby = await Lobby.findOne({ lobbyId });

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!lobby) {  // lobby wasn't found
    await interaction.editReply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.'
    });

    return;
  }

  if (!userIsLobbyLeader(interaction.user, lobby)) {
    await interaction.editReply({
      content: 'Only the leader can reserve spots!'
    });

    return;
  }

  lobby.members.push({
      user: "Reserved",
      guild: ""
  });

  await lobby.save();

  const lobbyMessage = await getLobbyMessage(lobby, interaction.client);
  await lobbyMessage.edit({
      embeds: [graidCreateEmbed(lobby, interaction.user.displayName)],
      components: [getButtonRow(lobby.lobbyId)]
  });

  await interaction.editReply({
      content: 'Reserved a spot successfully!'
  });

  await checkForFullLobby(lobby, interaction);
}