const { MessageFlags } = require("discord.js");
const removeUserFromLobby = require("../../utils/removeUserFromLobby");
const Lobby = require("../../models/Lobby");

module.exports = async (interaction, client) => {
  if (!interaction.isStringSelectMenu()) return;

  const lobbyId = interaction.customId.replace('kick-members-', '');
  const lobby = await Lobby.findOne({ lobbyId });
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!lobby) {  // lobby wasn't found
    await interaction.editReply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.',
    });

    return;
  }

  const kickedPlayerIndex = interaction.values[0];
  await removeUserFromLobby(lobby, kickedPlayerIndex, client);

  await interaction.editReply({
    content: 'Member kicked successfully!'
  });
}