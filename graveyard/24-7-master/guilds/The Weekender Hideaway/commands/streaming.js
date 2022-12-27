module.exports = {
  description: "Rename all bots on the server, so it says STREAMING vertically.",
  usage: {
    "<on|off>": "Decide if it's going to be enabled or disabled."
  },
  examples: {},
  aliases: [ "s" ],
  permissionRequired: 1,
  checkArgs: (args) => {
    return ["on", "off"].includes(args[0]);
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let botMsg = await message.channel.send({embed:{
    title: "Updating...",
    description: "Changing nicknames...",
    color: constants.colors.ok
  }})
  
  let bots = message.guild.roles.find(r => r.name.toLowerCase() == "beep boops").members.filter(bot => bot.user.presence.status != "offline").sort(function (a, b) { return a.user.username.toLowerCase().localeCompare(b.user.username.toLowerCase()); }).array();
  let botsSuccess = {};

  if (args[0].toLowerCase() == "on" && !quotes[parseInt(bots.length).toString()]) return botMsg.edit({embed:{
    title: "Error",
    description: "I do not support a quote with " + bots.length + " bots at the moment.",
    color: constants.colors.err
  }})

  for (var b in bots) {
      await bots[b].edit({ nick: (args[0].toLowerCase() == "on" ? bots[b].user.username + " " + quotes[parseInt(bots.length).toString()].split("|")[b] : '') }).then(() => { botsSuccess[bots[b].user.id] = true}).catch(() => { botsSuccess[bots[b].user.id] = false})
  }

  let success = true;
  for (var i in botsSuccess) if (!botsSuccess[i]) success = false;

  return botMsg.edit({embed:{
    title: (success ? "Success" : "Warning"),
    description: bots.map(bot => (botsSuccess[bot.user.id] ? "✅" : "❌") + " " + bot.toString()).join("\n"),
    color: (success ? constants.colors.ok : constants.colors.err)
  }})
}

const quotes = {
  "9": "S|T|R|E|A|M|I|N|G",
  "8": "S|T|R|E|M|I|N|G",
  "7": "S|T|R|E|M|N|G",
  "6": "S|T|R|E|A|M",
  "5": "S|T|R|E|M",
  "4": "L|I|V|E",
  "3": "T|T|V",
}