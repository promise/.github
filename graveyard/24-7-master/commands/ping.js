module.exports = {
  description: "Get the ping of the bot",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let botMsg = await message.channel.send("〽 Pinging...");
  botMsg.edit("🏓 Server latency is \`" + (botMsg.createdTimestamp - message.createdTimestamp) + "ms\` and API Latency is \`"+ Math.round(client.ping) + "ms\`.")
}