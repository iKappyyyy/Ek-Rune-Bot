module.exports = async (lobby, client) => {
    const channel = await client.channels.fetch(lobby.channelId);
    const message = await channel.messages.fetch(lobby.messageId);

    return message;
}