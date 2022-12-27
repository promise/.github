module.exports = {
  description: "Shorten a link in anger!..for some reason.",
  usage: {
    "[<alias>]": "The alias you want the url to exist of. If left empty, it will use a random ome.",
    "<url>": "The link you want to shorten."
  },
  examples: {
    "google.com": "Will make a short URL to google.com with a random alias.",
    "ytchannel youtube.com/...": "Will make a short url to youtube.com/... with the alias /ytchannel."
  },
  aliases: [ "fuckit" ],
  permissionRequired: 4,
  checkArgs: (args) => {
    return args.length && args.length <= 2;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let alias = args[1] ? args[0] : null;
  let url = args[1] || args[0];
  
  let aliasAvailability = args[1] ? false : true;
  if (alias) await fetch("https://fuck.it/" + alias).then(res => res.text()).then(res => { if (res == "") aliasAvailability = true; }).catch()
  if (!aliasAvailability) return message.channel.send(":warning: URL alias already exists. Please use another one.");
  fetch("https://fuck.it/api/?key=" + config.fuckitapikey + "&url=" + url + (alias ? "&custom=" + alias : "")).then(res => res.json()).then(res => {
    if (res.error == 1) return message.channel.send(":x: An error occoured. Please check console.") && console.log(res);
    return message.channel.send(":white_check_mark: " + res.short)
  }).catch(err => { message.channel.send(":x: An error occoured. Please check console."); console.log(err); })
}