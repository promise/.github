const config = require("../../config.json");

// load other files, and also general information
module.exports = {
  embedColor: 0xBD4632,
  hexColor: "BD4632",

  resolvers: require("./resolvers"),
  time: require("./time")
};

// permission calculator
module.exports.getPermissionLevel = member => {
  if (config.owner == member.id) return 4;
  if (member.guild.ownerID == member.id) return 3;
  if (member.hasPermission("MANAGE_GUILD")) return 2;
  if (member.hasPermission("MANAGE_MESSAGES")) return 1;
  return 0;
};

// filter duplicates
module.exports.onlyUnique = (value, index, self) => self.indexOf(value) == index;

// random id generator
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
module.exports.generateID = (alreadyGenerated) => {
  let id;
  while (!id || alreadyGenerated.includes(id)) {
    id = "";
    for (let i = 0; i < 6; i++) id = id + chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};