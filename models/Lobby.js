const mongoose = require('mongoose');
const { LobbyTTLMs } = require('../enums');
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
    members: [
        {
            user: String,
            guild: String
        }
    ],

    expiresAt: {
        type: Date,
        default: new Date(Date.now() + LobbyTTLMs),
        index: { expires: 0 }
    }
});

module.exports = mongoose.model('Lobby', lobbySchema);