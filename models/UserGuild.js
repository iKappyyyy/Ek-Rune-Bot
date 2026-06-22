const mongoose = require('mongoose');
const { UserGuildCachedTTLSeconds } = require('../enums');

const userGuildSchema = new mongoose.Schema({
    id: String,
    guild: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: UserGuildCachedTTLSeconds
    }
});

module.exports = mongoose.model('userGuild', userGuildSchema);