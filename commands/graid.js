const { SlashCommandBuilder, MessageFlags, LabelBuilder, ModalBuilder } = require("discord.js");
const { graidCreateEmbed } = require('../utils/embedCreator');
const getButtonRow = require("../utils/getButtonRow");
const createLobbyDocument = require("../utils/createLobbyDocument");
const getLobbyUserIsIn = require("../utils/getLobbyUserIsIn");
const removeUserFromLobby = require("../utils/removeUserFromLobby");
const getLobbyMessage = require("../utils/getLobbyMessage");
const { MinGuildTagLength, MaxGuildTagLength } = require("../enums");
const userIsLobbyLeader = require("../utils/userIsLobbyLeader");
const checkForFullLobby = require("../utils/checkForFullLobby");
const createRaidSelectionChoiceDropdown = require("../utils/createRaidSelectionChoiceDropdown");
const { generateId } = require("../utils/createCustomId");
const Lobby = require("../models/Lobby");
const userCanUseBot = require("../utils/userCanUseBot");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("graid")
        .setDescription("Manages all guild raid commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Creates a new guild raiding lobby!")
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
        if (!(await userCanUseBot(interaction))) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {   // create a graid lobby
            let lobbyId = generateId();
            while (await Lobby.exists({ lobbyId })) {
                lobbyId = generateId();
            }

            const raidSelectionModal = new ModalBuilder()
                .setCustomId(`select-raids-modal-${lobbyId}`)
                .setTitle('Raid Selection');
            const raidSelectionDropdown = createRaidSelectionChoiceDropdown(lobbyId);
            const raidSelectionDropdownLabel = new LabelBuilder()
                .setLabel('Which raids would you be open to playing?')
                .setStringSelectMenuComponent(raidSelectionDropdown);
            raidSelectionModal.addLabelComponents(raidSelectionDropdownLabel);

            await interaction.showModal(raidSelectionModal);

            const lobby = await createLobbyDocument(lobbyId, interaction.user, interaction.client);

            await lobby.save();
        } else if (subcommand === 'leave') {
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            if (lobbyUserIsIn) {
                await interaction.editReply({
                    content: `Successfully left ${lobbyUserIsIn.members[0].user}'s lobby.`
                });

                await removeUserFromLobby(lobbyUserIsIn, interaction.user, interaction.client);
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

                const lobbyLeader = await interaction.client.users.fetch(lobbyUserIsIn.members[0].user.replace(/[<@!>]/g, ""));

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

