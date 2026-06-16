const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!!")
        .addSubcommand(subcommand => 
            subcommand
                .setName("user")
                .setDescription("Pings a user!")
                .addUserOption(option =>
                    option
                        .setName("target")
                        .setDescription("The user to ping")
                        .setRequired(true)
                )
            ),

    run: ({ interaction }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "user") {
            const user = interaction.options.getUser("target");
            interaction.reply(`Pong!! ${user}`);
        }
    },
}