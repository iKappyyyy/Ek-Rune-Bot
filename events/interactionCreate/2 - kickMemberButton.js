const { MessageFlags, ActionRowBuilder, ModalBuilder, LabelBuilder } = require("discord.js");
const Lobby = require("../../models/Lobby");
const getLobbyMessage = require("../../utils/getLobbyMessage");
const userIsLobbyLeader = require("../../utils/userIsLobbyLeader");
const getKickMemberMenu = require("../../utils/getKickMemberMenu");

module.exports = async (interaction, client) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('kick-button-')) return;

  const lobbyId = interaction.customId.replace('kick-button-', '');
  const lobby = await Lobby.findOne({ lobbyId });
  
  if (!lobby) {  // lobby wasn't found
    await interaction.reply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.',
      flags: MessageFlags.Ephemeral
    });
    
    return;
  }
  
  const reply = await getLobbyMessage(lobby, client);

  if (lobby.members.length <= 1) {
    await interaction.reply({
      content: 'You are the only person in the lobby! who are you trying to kick??',
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  if (!userIsLobbyLeader(interaction.user, lobby)) {
    await interaction.reply({
      content: 'Only the leader can kick other members!',
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  const kickMemberModal = new ModalBuilder()
    .setCustomId(`kick-member-modal-${lobbyId}`)
    .setTitle('Kick a lobby member!');

  const kickMemberDropdown = await getKickMemberMenu(lobby, client);
  const kickMemberLabel = new LabelBuilder()
    .setLabel('Select the member you\'d like to kick:')
    .setStringSelectMenuComponent(kickMemberDropdown);

  kickMemberModal.addLabelComponents(kickMemberLabel);

  await interaction.showModal(kickMemberModal);
}