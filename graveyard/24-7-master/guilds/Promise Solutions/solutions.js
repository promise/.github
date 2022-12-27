const fs = require("fs")
const load = () => JSON.parse(fs.readFileSync("./guilds/Promise Solutions/solutions.json", "utf8"))
const save = (json) => fs.writeFileSync("./guilds/Promise Solutions/solutions.json", JSON.stringify(json, null, 2), "utf8")

module.exports.initiate = async (client, guild, config, constants) => {
  let channel = guild.channels.get("648608157714612270"), messages = await channel.fetchMessages({ limit: 50 }), settings = load();

  for (var solution of settings) {
    
    let m = messages.find(m => m.id == solution.message);
    if (!m) {
      m = await channel.send("Loading...")
      if (solution.labelrole) await m.react("🏷")
      if (solution.bellrole) await m.react("🔔")
      if (solution.pinned) await m.pin();
    }

    m.edit({ embed: solution.embed })

    solution.message = m.id;
  }

  save(settings)

  client.on("messageReactionAdd", async (reaction, user) => {
    let solution = settings.find(s => s.message == reaction.message.id)
    if (solution) {
      let member = await reaction.message.guild.fetchMember(user);
      if (reaction.emoji.name == "🏷") member.addRole(solution.labelrole)
      if (reaction.emoji.name == "🔔") {
        if (!solution.labelrole || member.roles.get(solution.labelrole)) member.addRole(solution.bellrole);
        else reaction.remove(member);
      }
    }
  }).on("messageReactionRemove", async (reaction, user) => {
    let solution = settings.find(s => s.message == reaction.message.id)
    if (solution) {
      let member = await reaction.message.guild.fetchMember(user);
      if (reaction.emoji.name == "🏷") {
        member.removeRole(solution.labelrole)
        if (member.roles.get(solution.bellrole)) {
          member.removeRole(solution.bellrole)
          reaction.message.reactions.find(r => r.emoji.name == "🔔").remove(member);
        }
      }
      if (reaction.emoji.name == "🔔") member.removeRole(solution.bellrole);
    }
  })
}