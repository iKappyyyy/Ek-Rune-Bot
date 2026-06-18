const { MaxLobbyMembers } = require("../enums")

module.exports = async (lobby, interaction) => {
    if (lobby.members.length < MaxLobbyMembers) return false;

    let membersString = '';
    for (let i = 0; i < MaxLobbyMembers; i++) {
        membersString += `${i + 1}) ${lobby.members[i]}\n`;
    }

    await interaction.channel.send(`${lobby.hostGuild}'s ${lobby.raidType} lobby is ready!\n\n${membersString}`);
}