const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");


module.exports = async (lobby, client) => {
  const options = await Promise.all(
    lobby.members.slice(1).map(async (member, i) => { // slice to skip leader kicking themselves
      if (member.user === "Reserved") {
        return new StringSelectMenuOptionBuilder()
          .setLabel(`${i + 2}) Reserved`)
          .setDescription(String(i + 1))
          .setValue(String(i + 1))
          .setEmoji('❌');
      }

      const user = await client.users.fetch(member.user.replace(/[<@!>]/g, ""));

      return new StringSelectMenuOptionBuilder()
        .setLabel(`${i + 2}) ${user.displayName}`)
        .setDescription(`@${user.username}`)
        .setValue(String(i + 1))
        .setEmoji('❌');
    })
  );

  return new StringSelectMenuBuilder()
    .setCustomId(`kick-members-${lobby.lobbyId}`)
    .setPlaceholder('Select which member to kick')
    .addOptions(options);
}