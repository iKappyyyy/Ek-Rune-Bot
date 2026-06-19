const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clears chat'),

    run: async ({ interaction }) => {
        await interaction.reply({
            content: `Clearing chat...\n${"\n".repeat(50)}Chat Cleared!`
        });
    },

    deleted: true
}
