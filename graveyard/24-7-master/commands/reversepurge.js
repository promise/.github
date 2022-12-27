module.exports = {
  description: "Purge from a message ID all the way to present time.",
  usage: {
    "<after message id>": "The message ID you want to purge everything after."
  },
  examples: {},
  aliases: [],
  permissionRequired: 4,
  checkArgs: (args) => {
    return args.length == 1;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let after = parseInt(args[0])
  if (!after) return message.channel.send("Invalid message ID.")
  
  after += 1;
  
  let processing = true, amount = 0;
  while (processing) {
    let messages = (await message.channel.fetchMessages({ limit: 100, after })).filter(m => m.id > after, true);
    if (!messages.array().length) processing = false;
    else {
      await message.channel.bulkDelete(messages);
      amount += messages.array().length;
    }
  }
  
  message.channel.send(":white_check_mark: Purged " + amount + " messages.").then(m => m.delete(5000))
  message.delete();
}