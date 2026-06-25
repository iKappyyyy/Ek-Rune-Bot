const { MessageFlags } = require("discord.js");
const { UserVerificationResponseCodes } = require("../enums");
const userIsVerified = require("./userIsVerified");

module.exports = async (interaction) => {
    switch (await userIsVerified(interaction.user)) {
        case UserVerificationResponseCodes.ERROR:
            interaction.reply({
                content: 'An error has occurred fetching your guild. Please contact an admin.',
                flags: MessageFlags.Ephemeral
            });
            return false;
        case UserVerificationResponseCodes.NOT_VERIFIED:
            interaction.reply({
                content: 'You are not verified. Please verify using the RaidKeeper bot.',
                flags: MessageFlags.Ephemeral
            });
            return false;
        case UserVerificationResponseCodes.NO_GUILD:
            interaction.reply({
                content: 'You are not in a guild. Please join one and re-verify to use the bot.',
                flags: MessageFlags.Ephemeral
            });
            return false;
    }

    return true;
}