module.exports = {
  description: "Get the bot uptime",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let totalSeconds = (client.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  
  message.channel.send(":timer: " + days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds.")
}