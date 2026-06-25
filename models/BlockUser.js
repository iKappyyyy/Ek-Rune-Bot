const mongoose = require('mongoose');

const blockUserSchema = new mongoose.Schema({
    blocker: String,
    blocked: String,
});

module.exports = mongoose.model('blockedUser', blockUserSchema);