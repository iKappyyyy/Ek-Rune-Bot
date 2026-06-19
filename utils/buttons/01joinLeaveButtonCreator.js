const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

module.exports = lobbyId => {
    return (
        new ButtonBuilder()
            .setCustomId(`join-button-${lobbyId}`)
            .setLabel('Join / Leave')
            .setStyle(ButtonStyle.Success)
    );
}
