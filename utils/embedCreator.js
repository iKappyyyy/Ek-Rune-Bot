const { EmbedBuilder } = require('discord.js');
const { MaxLobbyMembers } = require('../enums');

module.exports = {
    graidCreateEmbed: (lobby, lobbyAuthor) => {
        if (!Array.isArray(lobby.members)) lobby.members = [];
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
            .setTitle(`:dragon_face: ${lobbyAuthor.toUpperCase()} WANTS TO RAID! :dragon_face:`)
            .setDescription('Join the lobby using the \'Join / Leave\' button below!\n\n')
            .setColor(lobby.messageColor)
            .setThumbnail('https://github.com/iKappyyyy/Ek-Rune-Bot/blob/main/assets/ekRunePfp.png?raw=true')
            .setFooter({ text: 'Re-verify using the RaidKeeper bot to update your Guild!' })
            .setTimestamp()
            .addFields({
                name: 'Raids',
                value: lobby.raidList.join(', '),
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