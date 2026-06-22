const { MessageFlags, ActionRowBuilder } = require("discord.js");
const Lobby = require("../../models/Lobby");
const getLobbyMessage = require("../../utils/getLobbyMessage");
const userIsLobbyLeader = require("../../utils/userIsLobbyLeader");
const getKickMemberMenu = require("../../utils/getKickMemberMenu");

module.exports = async (interaction, client) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('kick-button-')) return;

  const lobbyId = interaction.customId.replace('kick-button-', '');
  const lobby = await Lobby.findOne({ lobbyId });
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  
  if (!lobby) {  // lobby wasn't found
    await interaction.editReply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.'
    });
    
    return;
  }
  
  const reply = await getLobbyMessage(lobby, client);

  if (lobby.members.length <= 1) {
    await interaction.editReply({
      content: 'You are the only person in the lobby! sad'
    });
    return;
  }

  if (!userIsLobbyLeader(interaction.user, lobby)) {
    await interaction.editReply({
      content: 'Only the leader can kick other members!',
    });
    return;
  }

  await interaction.editReply({
    content: 'Select the member you would like to kick:',
    components: [
      new ActionRowBuilder()
        .addComponents(await getKickMemberMenu(lobby, client))
    ],
  });
}