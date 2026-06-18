const mongoose = require('mongoose');
const { LobbyTTLSeconds } = require('../enums');
const getRandomColor = require('../utils/getRandomColor');

const lobbySchema = new mongoose.Schema({
    lobbyId: String,
    messageId: {
        type: String,
        default: "0"
    },
    messageColor: {
        type: Number,
        default: getRandomColor
    },
    channelId: {
        type: String,
        default: "0"
    },
    raidType: String,
    hostGuild: String,
    members: [String],

    createdAt: {
        type: Date,
        default: Date.now,
        expires: LobbyTTLSeconds
    }
});

module.exports = mongoose.model('Lobby', lobbySchema);