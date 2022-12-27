module.exports = {
  description: "Get a very unique number from 0 to 999.",
  usage: {
    "[<member>]": "A target. Default is yourself."
  },
  examples: {},
  aliases: [ "un" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return args.length <= 1;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let member = args[0] ? message.guild.members.get(args[0]) : message.member;
  if (!member) member = message.guild.members.get(args[0].replace("<@", "").replace("!", "").replace(">", ""));
  if (!member) return message.channel.send(":x: User not found.")

  message.channel.send(":white_check_mark: " + (message.author.id == member.id ? "Your" : member + "'s") + " very unique number is: " + member.id % 1000)
}