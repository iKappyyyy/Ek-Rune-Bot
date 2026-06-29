module.exports = (lobby, userId) => {
  const blacklistedUsers = [...lobby.blacklist.values()].flat();

  return blacklistedUsers.includes(String(userId));
}