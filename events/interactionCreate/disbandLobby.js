const { MessageFlags } = require("discord.js");
const Lobby = require("../../models/Lobby");
const getLobbyMessage = require("../../utils/getLobbyMessage");
const userIsLobbyLeader = require("../../utils/userIsLobbyLeader");

module.exports = async (interaction, client) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('disband-button-')) return;

  const lobbyId = interaction.customId.replace('disband-button-', '');
  const lobby = await Lobby.findOne({ lobbyId });
  const reply = await getLobbyMessage(lobby, client);
  
  if (!userIsLobbyLeader(interaction.user, lobby)) {
    await interaction.reply({
      content: 'Only the leader can disband the lobby',
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  try {
    await reply.delete();
  } catch (error) {
    console.log(`there was an error deleting the reply. error: ${error}`);
  }

  try {
    await Lobby.deleteOne({ lobbyId });
  } catch (error) {
    console.log(`there was an error deleting the lobby. error: ${error}`);
  }

  await interaction.reply({
    content: 'Disbanded the lobby successfully!',
    flags: MessageFlags.Ephemeral
  });
}