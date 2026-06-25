const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Raids } = require("../enums");

module.exports = lobbyId => {
    const options = Raids.map(raidObj =>
        new StringSelectMenuOptionBuilder()
            .setLabel(raidObj.raid)
            .setValue(raidObj.raid)
            .setEmoji(raidObj.emoji)
    );

    const userSelect = new StringSelectMenuBuilder()
        .setCustomId(`select-raids-${lobbyId}`)
        .setPlaceholder('Select one or more raids...')
        .setMinValues(1)
        .setMaxValues(Raids.length)
        .addOptions(options);

    return userSelect;
}