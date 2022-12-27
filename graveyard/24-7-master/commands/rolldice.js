module.exports = {
  description: "",
  usage: {
    "[<sides>]": "The number of sides the dice will have."
  },
  examples: {},
  aliases: [ "dice" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !!args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let number = args[0] ? parseInt(args[0]) : 6
  if (!number) return message.channel.send(":x: Invalid number.")

  message.channel.send("🎲 I got " + Math.ceil(Math.random() * number) + "!")
}