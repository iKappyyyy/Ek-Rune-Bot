const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

module.exports = lobbyId => {
    return (
        new ButtonBuilder()
            .setCustomId(`reserve-button-${lobbyId}`)
            .setLabel('Reserve Spot')
            .setStyle(ButtonStyle.Secondary)
    );
}