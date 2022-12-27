module.exports = {
  description: "Get a dadjoke.",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  fetch("https://icanhazdadjoke.com/", { headers: {
    "Accept": "application/json",
    "User-Agent": "Promise 24/7 Discord bot (https://github.com/gleeny/24-7/blob/master/commands/dadjoke.js) (24-7@promise.solutions)"
  }}).then(res => res.json()).then(dad => {
    message.channel.send("👨 " + dad.joke)
  }).catch(() => message.channel.send("Sorry, the dads are working hard and are not available at the moment. Please try again later."))
}