module.exports = {
  description: "Get info on the bot.",
  usage: {},
  examples: {},
  aliases: [ "help", "botinfo" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  message.channel.send({
    embed: {
      title: "Promise 24/7",
      description: "Hello! I am a very simple bot, making the lives of the server admins easier. This is a private bot, meaning if this server has it - they are probably friends with the owner of this bot. Cheers!",
      color: 0x7289DA
    }
  })
}