const { MessageFlags } = require("discord.js");
const Lobby = require("../../models/Lobby");
const getLobbyMessage = require("../../utils/getLobbyMessage");
const userIsLobbyLeader = require("../../utils/userIsLobbyLeader");

module.exports = async (interaction, client) => {
  if (!interaction.isButton() || !interaction.customId.startsWith('disband-button-')) return;

  const lobbyId = interaction.customId.replace('disband-button-', '');
  const lobby = await Lobby.findOne({ lobbyId });
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  
  if (!lobby) {  // lobby wasn't found
    await interaction.editReply({
      content: 'Sorry, the lobby couldn\'t be found. Please create a new lobby.'
    });
    
    return;
  }

  const reply = await getLobbyMessage(lobby, client);
  
  if (!userIsLobbyLeader(interaction.user, lobby)) {
    await interaction.editReply({
      content: 'Only the leader can disband the lobby',
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

  await interaction.editReply({
    content: 'Disbanded the lobby successfully!',
  });
}