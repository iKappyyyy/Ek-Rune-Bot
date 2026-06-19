const fs = require("fs");
const path = require("path");
const { ActionRowBuilder } = require("discord.js");

module.exports = lobbyId => {
    const buttonsPath = path.join(__dirname, "buttons");

    const buttons = fs.readdirSync(buttonsPath)
        .map(file => {
            const buttonCreator = require(path.join(buttonsPath, file));
            return buttonCreator(lobbyId);
        });

    return new ActionRowBuilder()
        .addComponents(buttons);
};