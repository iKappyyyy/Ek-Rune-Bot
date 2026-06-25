require('dotenv').config();
const { UserVerificationResponseCodes } = require('../enums');
const UserGuild = require('../models/UserGuild');

module.exports = async user => {
  try {
    const guildDoc = await UserGuild.findOneAndUpdate(
      { id: user.id },
      { createdAt: new Date() },
      { returnDocument: 'after' }
    );

    if (guildDoc) return guildDoc.guild;

    const response = await fetch(
      `https://raidkeeper.raidersbot.workers.dev/api/v1/user?discord_id=${user.id}`,
      { headers: { Authorization: `Bearer ${process.env.RAIDKEEPER_API_KEY}` } }
    ).then(data => data.json());

    if (response.error === "User not verified") {
        return UserVerificationResponseCodes.NOT_VERIFIED;
    }

    if (!response.wynncraft_guild_tag) {
        return UserVerificationResponseCodes.NO_GUILD;
    }

    const userGuild = new UserGuild({
        id: user.id,
        guild: response.wynncraft_guild_tag,
    });

    await userGuild.save();

    return UserVerificationResponseCodes.VERIFIED;

  } catch (error) {
    console.log(`Error fetching guild: ${error}`);
    return UserVerificationResponseCodes.ERROR;
  }
}