module.exports = (user, lobby) => {
  const leader = lobby.members[0].user;

  return (leader === String(user));
}