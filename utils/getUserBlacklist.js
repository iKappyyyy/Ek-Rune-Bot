const BlockUser = require("../models/BlockUser");

module.exports = async userId => {
  const blacklistRelationships = await BlockUser.find({
    blocker: String(userId)
  });

  const blacklist = blacklistRelationships.map(relationship => relationship.blocked);
  return blacklist;
}