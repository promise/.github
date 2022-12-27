module.exports = {
  description: "Ask the magic 8-ball a question.",
  usage: {
    "<question ...>": "The question you want to ask"
  },
  examples: {
    "Will my carrots rot?": "Ask the magic 8-ball if your carrots will rot."
  },
  aliases: [ "8b", "8" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !!args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let random = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)]
  message.channel.send(constants.emojis[responses[random]] + " " + random)
}

const responses = {
  "It is certain.": "online",
  "It is decidedly so.": "online",
  "Without a doubt.": "online",
  "Yes - definitely.": "online",
  "You may rely on it": "online",
  "As I see it, yes.": "online",
  "Most likely.": "online",
  "Outlook good.": "online",
  "Yes.": "online",
  "Signs point to yes.": "online",
  "Reply hazy, try again.": "idle",
  "Ask again later.": "idle",
  "Better not tell you now.": "idle",
  "Cannot predict now.": "idle",
  "Concentrate and ask again.": "idle",
  "Don't count on it.": "dnd",
  "My reply is no.": "dnd",
  "My sources say no.": "dnd",
  "Outlook not so good.": "dnd",
  "Very doubtful.": "dnd"
}