const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

module.exports = lobbyId => {
  return (
    new ButtonBuilder()
      .setCustomId(`disband-button-${lobbyId}`)
      .setLabel('Disband')
      .setStyle(ButtonStyle.Danger)
);
}