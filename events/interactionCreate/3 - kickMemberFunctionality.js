const { MessageFlags } = require("discord.js");
const removeUserFromLobby = require("../../utils/removeUserFromLobby");
const Lobby = require("../../models/Lobby");

module.exports = async (interaction, client) => {
  if (!interaction.isModalSubmit() || !interaction.customId.startsWith('kick-member-modal-')) return;

  const lobbyId = interaction.customId.replace('kick-member-modal-', '');
  const lobby = await Lobby.findOne({ lobbyId });

  if (!lobby) {  // lobby wasn't found
    await interaction.reply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.',
      flags: MessageFlags.Ephemeral
    });

    return;
  }

  const kickedPlayerIndex = interaction.fields.getStringSelectValues(`kick-members-dropdown-${lobbyId}`)[0];
  await removeUserFromLobby(lobby, kickedPlayerIndex, client);
  await interaction.deferUpdate();
}