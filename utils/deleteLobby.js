const getLobbyMessage = require("./getLobbyMessage");
const getReadyMessage = require("./getReadyMessage");

module.exports = async (lobby, client) => {
  if (lobby.raidList.length >= 1) {
    const lobbyMessage = await getLobbyMessage(lobby, client);
    const readyMessage = await getReadyMessage(lobby, client);

    await lobbyMessage.delete();
    if (readyMessage) {
      await readyMessage.delete();
    }
  }
  
  await lobby.deleteOne();
}
