module.exports = async (lobby, client) => {
  if (lobby.readyMessageId === "") return null;

  const channel = await client.channels.fetch(lobby.channelId);
  const message = await channel.messages.fetch(lobby.readyMessageId);

  return message;
}