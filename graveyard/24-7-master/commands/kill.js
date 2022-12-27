module.exports = {
  description: "Kill the bot.",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 4,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  await message.react("🌀")
  process.exit(1)
}