const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { graidCreateEmbed } = require('../utils/embedCreator');
const joinLeaveButtonCreator = require("../utils/joinLeaveButtonCreator");
const createLobby = require("../utils/createLobby");
const getLobbyUserIsIn = require("../utils/getLobbyUserIsIn");
const removeUserFromLobby = require("../utils/removeUserFromLobby");
const getLobbyMessage = require("../utils/getLobbyMessage");

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
                            { name: "Any", value: "Any" },
                            { name: "NOTG", value: "NOTG" },
                            { name: "NOL", value: "NOL" },
                            { name: "TCC", value: "TCC" },
                            { name: "TNA", value: "TNA" },
                            { name: "WTP", value: "WTP" }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("leave")
                .setDescription('Leave your current guild raid lobby.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("show")
                .setDescription('Resend your lobby\'s message!')    
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
        } else if (subcommand === 'leave') {
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            if (lobbyUserIsIn) {
                await removeUserFromLobby(lobbyUserIsIn, interaction.user, interaction.client);

                await interaction.editReply({
                    content: `Successfully left ${lobbyUserIsIn.hostGuild}'s ${lobbyUserIsIn.raidType} lobby.`
                });
            } else {
                await interaction.editReply({
                    content: 'You are not in any existing lobby!'
                });
            }
        } else if (subcommand === 'show') {
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            await interaction.deferReply();

            if (lobbyUserIsIn) {
                const lobbyMessage = await getLobbyMessage(lobbyUserIsIn, interaction.client);
                try {
                    lobbyMessage.delete();
                } catch (error) {
                    console.log(`An error occurred while trying to delete a message. error: ${error}`);
                }



                await interaction.editReply({
                    embeds: [graidCreateEmbed(lobbyUserIsIn)],
                    components: [joinLeaveButtonCreator(lobbyUserIsIn.lobbyId)]
                });


                const message = await interaction.fetchReply();
                lobbyUserIsIn.channelId = message.channel.id;
                lobbyUserIsIn.messageId = message.id;
                await lobbyUserIsIn.save();

            } else {
                await interaction.editReply({
                    content: 'You are not in any existing lobby!',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
    
}