require('dotenv').config();
const UserGuild = require('../models/UserGuild');

module.exports = async user => {
  try {
    const guildDoc = await UserGuild.findOneAndUpdate(
      { id: user.id },
      { createdAt: new Date() },
      { returnDocument: 'after' }
    );

    return guildDoc.guild;
  } catch (error) {
    console.log(`Error fetching guild: ${error}`);
  }
}