require('dotenv').config({quiet: true});
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const userCanUseBot = require('./utils/userCanUseBot');
const deleteEmptyLobbies = require('./utils/deleteEmptyLobbies');
const { EmptyLobbyCheckTimeMs } = require('./enums');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to DB");

    new CommandHandler({
      client,
      commandsPath: path.join(__dirname, "commands"),
      eventsPath: path.join(__dirname, "events"),
      validationsPath: path.join(__dirname, "validations")
    });

    setInterval(async () => {
      await deleteEmptyLobbies(client);
    }, EmptyLobbyCheckTimeMs);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
