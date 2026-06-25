const Lobby = require("../../models/Lobby");
const { graidCreateEmbed } = require("../../utils/embedCreator");
const getButtonRow = require("../../utils/getButtonRow");

module.exports = async (interaction, client) => {
  if (!interaction.isModalSubmit() || !interaction.customId.startsWith('select-raids-modal-')) return;

  const lobbyId = interaction.customId.replace('select-raids-modal-', '');
  const lobby = await Lobby.findOne({ lobbyId });

  const selectedRaids = interaction.fields.getStringSelectValues(`select-raids-${lobbyId}`);
  lobby.raidList = selectedRaids;

  await interaction.reply({
    embeds: [graidCreateEmbed(lobby, interaction.user.displayName)],
    components: [getButtonRow(lobby.lobbyId)],
  });

  const message = await interaction.fetchReply();

  lobby.channelId = message.channel.id;
  lobby.messageId = message.id;
  await lobby.save();
}
