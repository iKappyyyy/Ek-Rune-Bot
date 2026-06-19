const { EmbedBuilder } = require('discord.js');
const { MaxLobbyMembers } = require('../enums');

module.exports = {
    graidCreateEmbed: (lobby) => {
        if (!Array.isArray(lobby.members)) lobby.members=[];
        lobby.members = lobby.members.slice(0, MaxLobbyMembers);

        const vacancyNumberString = `${lobby.members.length}/${MaxLobbyMembers}`;

        let membersString = `\n`;
        for (let i = 0; i < MaxLobbyMembers; i++) {
            if (i < lobby.members.length) {
                membersString += `${i + 1}) ${lobby.members[i].user} ${lobby.members[i].guild !== "" ? `[${lobby.members[i].guild}]` : ''}${!i ? " :crown:" : ""}`;
            } else {
                membersString += `${i + 1}) Vacant`;
            }

            membersString += '\n';
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
                name: 'Members',
                value: `${lobby.members.length}/${MaxLobbyMembers}`,
                inline: true
            }, {
                name: '',
                value: membersString
            });

        return embed;
    },
}