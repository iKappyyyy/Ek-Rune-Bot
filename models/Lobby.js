const mongoose = require('mongoose');
const { LobbyTTLMs } = require('../enums');
const getRandomColor = require('../utils/getRandomColor');

const lobbySchema = new mongoose.Schema({
    lobbyId: String,
    messageId: {
        type: String,
        default: "0"
    },
    readyMessageId: {
        type: String,
        default: ""
    },
    messageColor: {
        type: Number,
        default: getRandomColor
    },
    channelId: {
        type: String,
        default: "0"
    },
    raidList: {
        type: [String],
        default: []
    },
    members: [
        {
            user: String,
            guild: String
        }
    ],
    blacklist: {
        type: Map,
        of: [String],
        default: {}
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + LobbyTTLMs),
    }
});

module.exports = mongoose.model('Lobby', lobbySchema);
