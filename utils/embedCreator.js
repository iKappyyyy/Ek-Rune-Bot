const { EmbedBuilder } = require('discord.js');
const { MaxLobbyMembers } = require('../enums');

module.exports = {
    graidCreateEmbed: (lobby) => {
        if (!Array.isArray(lobby.members)) lobby.members=[];
        lobby.members = lobby.members.slice(0, MaxLobbyMembers);

        const vacancyNumberString = `${lobby.members.length}/${MaxLobbyMembers}`;

        let membersString = `${vacancyNumberString}\n\n`;
        for (let i = 0; i < MaxLobbyMembers; i++) {
            if (i < lobby.members.length) {
                membersString += `${lobby.members[i]}\n`;
            } else {
                membersString += 'Vacant\n';
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(':rotating_light: Epic Graid Alert :rotating_light:')
            .setDescription(`super epic graid lobby bot`)
            .setColor(lobby.messageColor)
            .addFields({
                name: 'Raid Type',
                value: lobby.raidType,
                inline: true
            }, {
                name: 'Hosted by',
                value: lobby.hostGuild,
                inline: true
            }, {
                name: 'Members',
                value: `${membersString}`
            });

        return embed;
    },
}