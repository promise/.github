module.exports = {
  description: "Will ask the user sending the command, or the pinged user, for an invite. It will then \"steal\" the server ID, making it easier for support.",
  usage: {
    "[<user>]": "The question you want to ask"
  },
  examples: {
    "<@110090225929191424>": "Will try and steal a server ID from user with ID 110090225929191424."
  },
  aliases: [ "ssid", "fetch-sid", "fsid", "sid", "get-sid", "gsid" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return true;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let user = message.member;
  if (args[0]) {
    user = message.guild.members.get(args[0])
    if (!user) user = message.guild.members.get(args[0].replace("<@", "").replace("!", "").replace(">", ""))
    if (!user) return message.channel.send("❌ User was not found.")
  }

  if (user.id == message.author.id) user.send("🔰 Hi there! Please send the server invite here, and I will gather all information we need to assist you. By doing this, you agree on that any support team member can join your server if you need support. Your invite link will not be shared publicly.").then(async dmMsg => {
    let botMsg = await message.channel.send("♨️ Check your DMs for instructions: [<" + dmMsg.url + ">]")
    dmMsg.channel.awaitMessages(() => true, { max: 1, time: 60000, errors: [ "time" ]}).then(async collected => {
      let link = collected.first().content
      try {
        let invite = await client.fetchInvite(link)
        let logMsg = await message.guild.channels.get("645631413504180227").send(invite.url)
        botMsg.edit(invite.guild.id, { embed: { description: "[Invite (support team only)](" + logMsg.url + ")"}})
        return dmMsg.channel.send("✅ Done! Go back: [<" + botMsg.url + ">]")
      } catch(e) {
        return dmMsg.channel.send("❌ Invalid invite, cancelled. Go back: [<" + botMsg.url + ">]") && botMsg.edit("❌ Cancelled by target.");
      }
    }).catch(() => dmMsg.edit("❌ Timed out. Go back: [<" + botMsg.url + ">]") && botMsg.edit("❌ Timed out."))
  }).catch(() => message.channel.send("❌ Your DMs are disabled! Enable them, and run the command again."))

  else user.send("🔰 Hi there! " + message.author + " has requested a server invite from you, and I will gather all information we need to assist you as fast as possible. By doing this, you agree on that any support team member can join your server if you need support. Your invite link will not be shared publicly.").then(async dmMsg => {
    let botMsg = await message.channel.send("♨️ " + user.toString() + ", check your DMs for instructions: [<" + dmMsg.url + ">]")
    dmMsg.channel.awaitMessages(() => true, { max: 1, time: 60000, errors: [ "time" ]}).then(async collected => {
      let link = collected.first().content
      try {
        let invite = await client.fetchInvite(link)
        let logMsg = await message.guild.channels.get("645631413504180227").send(invite.url)
        botMsg.edit(invite.guild.id, { embed: { description: "[Invite (support team only)](" + logMsg.url + ")"}})
        return dmMsg.channel.send("✅ Done! Go back: [<" + botMsg.url + ">]")
      } catch(e) {
        return dmMsg.channel.send("❌ Invalid invite, cancelled. Go back: [<" + botMsg.url + ">]") && botMsg.edit("❌ Cancelled.");
      }
    }).catch(() => dmMsg.edit("❌ Timed out. Go back: [<" + botMsg.url + ">]") && botMsg.edit("❌ Timed out."))
  }).catch(() => message.channel.send("❌ Their DMs are disabled!"))
}