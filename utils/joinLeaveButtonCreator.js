const { ButtonBuilder } = require("@discordjs/builders");
const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

module.exports = lobbyId => {
    const row = new ActionRowBuilder();

    row.components.push(
        new ButtonBuilder()
            .setCustomId(`join-button-${lobbyId}`)
            .setLabel('Join / Leave')
            .setStyle(ButtonStyle.Success)
    );

    return row;
}