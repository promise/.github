module.exports = {
  description: "Flip a coin",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  if (Math.round(Math.random())) message.channel.send("🉑 It's heads!");
  else message.channel.send("🉑 It's tails!");
}