const Lobby = require("../models/Lobby");
const deleteLobby = require("./deleteLobby");

module.exports = async (client) => {
  const lobbies = await Lobby.find();
  for (const lobby of lobbies) {
    if (lobby.expiresAt < Date.now() || lobby.raidList.length <= 0) {
      await deleteLobby(lobby, client);
    }
  }
}