const userCanUseBot = require("../utils/userCanUseBot")

module.exports = async (interaction) => {
  if (!(await userCanUseBot(interaction))) return true;
}