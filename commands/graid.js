const { SlashCommandBuilder } = require("discord.js");
const { graidCreateEmbed } = require('../utils/embedCreator');
const joinLeaveButtonCreator = require("../utils/joinLeaveButtonCreator");
const createLobby = require("../utils/createLobby");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("graid")
        .setDescription("Manages all guild raid commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Creates a new guild raiding lobby!")
                .addStringOption(option =>
                    option
                        .setName("raid-type")
                        .setDescription("The lobby's raid type")
                        .setRequired(true)
                        .addChoices(
                            { name: "NOTG", value: "NOTG" },
                            { name: "NOL", value: "NOL" },
                            { name: "TCC", value: "TCC" },
                            { name: "TNA", value: "TNA" }
                        )
                )
        ),
    run: async ({ interaction }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {   // create a graid lobby
            const raidType = interaction.options.get('raid-type').value;
            const lobby = await createLobby(raidType, "SMOL", interaction.user, interaction.client);
            const buttonRow = joinLeaveButtonCreator(lobby.lobbyId);

            await interaction.reply({
                embeds: [graidCreateEmbed(lobby)],
                components: [buttonRow],
            });

            const message = await interaction.fetchReply();

            lobby.channelId = message.channel.id;
            lobby.messageId = message.id;
            await lobby.save();
        }
    }
    
}