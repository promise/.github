module.exports.initiate = async (client, guild, config, constants) => {
  client.on("message", async message => { if (!message.guild || message.guild.id !== guild.id) return;
    if (message.channel.id == "492462213173608448") message.react("👍").then(() => message.react("👎"))
  })
}