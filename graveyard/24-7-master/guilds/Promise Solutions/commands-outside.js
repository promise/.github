module.exports.initiate = async (client, guild, config, constants) => {
  client.on("message", async message => { if (!message.guild || message.guild.id !== guild.id) return;
    if (!message.channel.name.endsWith("commands")) for (var prefix of ["c!", "c?", "v!", "n!", "-", "P:"]) if (message.content.startsWith(prefix)) message.react("⁉").then(r => setTimeout(() => r.remove(), 10000))
  });
}