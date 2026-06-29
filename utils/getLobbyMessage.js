module.exports = async (lobby, client) => {
    try {
        const channel = await client.channels.fetch(lobby.channelId);
        const message = await channel.messages.fetch(lobby.messageId);
        
        return message;
    } catch (error) {
        // in case of a ghost lobby
        return null;
    }

}