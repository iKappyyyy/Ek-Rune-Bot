const { MaxLobbyMembers, FullLobbyTTLMs } = require("../enums")

module.exports = async (lobby, interaction) => {
    if (lobby.members.length < MaxLobbyMembers) return false;

    let membersString = '';
    for (let i = 0; i < MaxLobbyMembers; i++) {
        membersString += `${i + 1}) ${lobby.members[i].user}\n`;
    }

    await interaction.channel.send(`${lobby.members[0].user}'s lobby is ready!\n\nMembers:\n${membersString}`);
    lobby.expiresAt = new Date(Date.now() + FullLobbyTTLMs);
    await lobby.save();

    return true;
}