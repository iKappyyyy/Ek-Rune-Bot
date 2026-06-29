const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const BlockUser = require("../models/BlockUser");
const getLobbyUserIsIn = require("../utils/getLobbyUserIsIn");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist users you don\'t want joining your lobbies!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to your lobby blacklist!')
                .addStringOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you would like to blacklist')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from your lobby blacklist!')
                .addStringOption(option =>
                    option
                        .setName('user')
                        .setDescription('Ping/Paste the discord ID of the user you would like to blacklist here')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('List all members that are a part of your lobby blacklist!')
        ),

    run: async ({ interaction }) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const blacklistUserID = interaction.options.get('user').value.replace(/[<>@]/g, "");
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            if (String(blacklistUserID) === String(interaction.user.id)) {
                await interaction.editReply({
                    content: 'You cannot blacklist yourself silly'
                });

                return;
            }

            const blacklistUser = await interaction.client.users.fetch(blacklistUserID).catch(() => null);
            if (!blacklistUser) {
                await interaction.editReply({
                    content: 'Please ping or enter the id of a valid discord user!'
                });

                return;
            }

            if (await BlockUser.exists({ blocker: String(interaction.user.id), blocked: blacklistUserID })) {
                await interaction.editReply({
                    content: `${blacklistUser} was already in your blacklist!`
                });

                return;
            }

            const blacklistUserDoc = new BlockUser({
                blocker: String(interaction.user.id),
                blocked: blacklistUser.id
            });

            await blacklistUserDoc.save();
            
            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            if (lobbyUserIsIn) {
                lobbyUserIsIn.blacklist.get(String(interaction.user.id)).push(blacklistUser.id);

                await lobbyUserIsIn.save();
            }

            await interaction.editReply({
                content: `Successfully blacklisted ${blacklistUser}!`
            });
        } else if (subcommand === 'remove') {
            const blacklistUserID = interaction.options.get('user').value.replace(/[<>@]/g, "");
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const blacklistUser = await interaction.client.users.fetch(blacklistUserID).catch(() => null);
            if (!blacklistUser) {
                await interaction.editReply({
                    content: 'Please ping or enter the id of a valid discord user!'
                });

                return;
            }

            const blacklistUserDoc = await BlockUser.findOneAndDelete({
                blocker: String(interaction.user.id),
                blocked: blacklistUserID
            });

            if (!blacklistUserDoc) {
                await interaction.editReply({
                    content: `${blacklistUser} wasn't in your blacklist!`
                });

                return;
            }

            const lobbyUserIsIn = await getLobbyUserIsIn(interaction.user);
            if (lobbyUserIsIn) {
                console.log(lobbyUserIsIn.blacklist);
                console.log(String(interaction.user.id))
                console.log(lobbyUserIsIn.blacklist.get(String(interaction.user.id)));
                const newBlacklist = lobbyUserIsIn.blacklist.get(String(interaction.user.id)).filter(blockedUser => blockedUser !== blacklistUserID);
                lobbyUserIsIn.blacklist.set(String(interaction.user.id), newBlacklist);
                await lobbyUserIsIn.save();
            }

            await interaction.editReply({
                content: `Successfully removed ${blacklistUser} from your blacklist!`
            });
        } else if (subcommand === 'show') {
            const blacklistRelationships = await BlockUser.find({
                blocker: String(interaction.user.id)
            });

            if (blacklistRelationships.length <= 0) {
                await interaction.reply({
                    content: 'Your blacklist is empty!',
                    flags: MessageFlags.Ephemeral
                });

                return;
            }

            let membersString = '';
            for (let i = 0; i < blacklistRelationships.length; i++) {
                membersString += `${i + 1}) <@${blacklistRelationships[i].blocked}>\n`;
            }

            await interaction.reply({
                content: `**Your blacklist members are:**\n\n${membersString}`,
                flags: MessageFlags.Ephemeral
            });
        }
    },

    deleted: true
}