const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { graidCreateEmbed } = require('../utils/embedCreator');
const getButtonRow = require("../utils/getButtonRow");
const createLobby = require("../utils/createLobby");
const getLobbyUserIsIn = require("../utils/getLobbyUserIsIn");
const removeUserFromLobby = require("../utils/removeUserFromLobby");
const getLobbyMessage = require("../utils/getLobbyMessage");
const { MinGuildTagLength, MaxGuildTagLength, userVerificationResponseCodes } = require("../enums");
const userIsLobbyLeader = require("../utils/userIsLobbyLeader");
const checkForFullLobby = require("../utils/checkForFullLobby");
const userIsVerified = require("../utils/userIsVerified");

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
                            { name: "TWP", value: "TWP" }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("leave")
                .setDescription('Leave your current guild raid lobby. haha leave lollll')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("show")
                .setDescription('Resend your lobby\'s message!')    
        ),

    run: async ({ interaction }) => {
        // check for user verification
        switch (await userIsVerified(interaction.user)) {
            case userVerificationResponseCodes.ERROR:
                interaction.reply({
                    content: 'An error has occurred fetching your guild. Please contact an admin.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            case userVerificationResponseCodes.NOT_VERIFIED:
                interaction.reply({
                    content: 'You are not verified. Please verify using the RaidKeeper bot.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            case userVerificationResponseCodes.NO_GUILD:
                interaction.reply({
                    content: 'You are not in a guild. Please join one and re-verify to use the bot.',
                    flags: MessageFlags.Ephemeral
                });
                return;
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {   // create a graid lobby
            const raidType = interaction.options.get('raid-type').value;
            const lobby = await createLobby(raidType, interaction.user, interaction.client);

            await interaction.reply({
                embeds: [graidCreateEmbed(lobby, interaction.user.displayName)],
                components: [getButtonRow(lobby.lobbyId)],
            });

            const message = await interaction.fetchReply();

            lobby.channelId = message.channel.id;
            lobby.messageId = message.id;
            await lobby.save();
        } else if (subcommand === 'leave') {
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            if (lobbyUserIsIn) {
                await interaction.editReply({
                    content: `Successfully left ${lobbyUserIsIn.members[0].user}'s ${lobbyUserIsIn.raidType} lobby.`
                });
                
                await removeUserFromLobby(lobbyUserIsIn, interaction.user, interaction.client);
            } else {
                await interaction.editReply({
                    content: 'You are not in any existing lobby!'
                });
            }
        } else if (subcommand === 'show') {
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            if (lobbyUserIsIn) {
                const lobbyMessage = await getLobbyMessage(lobbyUserIsIn, interaction.client);
                try {
                    lobbyMessage.delete();
                } catch (error) {
                    console.log(`An error occurred while trying to delete a message. error: ${error}`);
                }
      
                const lobbyLeader = await interaction.client.users.fetch(lobby.members[0].user.replace(/[<@!>]/g, ""));

                await interaction.editReply({
                    embeds: [graidCreateEmbed(lobbyUserIsIn, lobbyLeader.displayName)],
                    components: [getButtonRow(lobbyUserIsIn.lobbyId)]
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
    },

    deleted: true
    
}