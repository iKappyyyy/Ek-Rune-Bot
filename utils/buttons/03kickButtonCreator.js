const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

module.exports = lobbyId => {
  return (
    new ButtonBuilder()
      .setCustomId(`kick-button-${lobbyId}`)
      .setLabel('Kick Member')
      .setStyle(ButtonStyle.Secondary)
);
}