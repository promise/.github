const fs = require("fs");
const getUsers = () => JSON.parse(fs.readFileSync("./guilds/Promise Solutions/votes.json")),
      writeUsers = (users) => fs.writeFileSync("./guilds/Promise Solutions/votes.json", JSON.stringify(users, null, 4), "utf8");

module.exports.initiate = async (client, guild, config, constants) => {
  client.on("message", async message => {
    if (message.channel.id !== "484811103101255680" || !message.webhookID) return;
    
    let [user, source] = message.content.split(" @ ");
    let users = getUsers()
    
    if (!users[user]) users[user] = 0;
    users[user] += 1;
    
    if (!users.today) users.today = {}
    if (!users.today[user]) users.today[user] = []
    users.today[user].push(Date.now() + 86400000) // time now + 24 hours
    
    writeUsers(users)

    let fetchedUser = await client.fetchUser(user, false);
    
    await message.guild.channels.get("581901184709820446").send({
      embed: {
          author: {
              icon_url: fetchedUser.avatar ? "https://cdn.discordapp.com/avatars/" + fetchedUser.id + "/" + fetchedUser.avatar + (fetchedUser.avatar.startsWith("a_") ? ".gif" : ".png") : "https://cdn.discordapp.com/embed/avatars/0.png",
              name: fetchedUser.username + "#" + fetchedUser.discriminator
          },
          color: (users.today[fetchedUser.id].length >= 6 ? 5135764 : 7506394),
          description: "**Thanks for voting @ " + source + "!**",
          footer: {
              text: "📌 See pinned messages, vote and get fancy roles!"
          }
      }
    })
  })
  
  setInterval(() => {
    let users = getUsers()

    for (var i in users.today) {
        let userTimestamps = users.today[i];
        for (var j in userTimestamps) if (userTimestamps[j] <= Date.now()) {
            userTimestamps = userTimestamps.filter(ms => ms != userTimestamps[j])
        }

        try {
            if (userTimestamps.length >= 1) guild.members.get(i).addRole("496237757216325633", "Vote").catch(); else guild.members.get(i).removeRole("496237757216325633", "Vote").catch();
            if (userTimestamps.length >= 6) guild.members.get(i).addRole("510555278580645892", "Vote").catch(); else guild.members.get(i).removeRole("510555278580645892", "Vote").catch();
        } catch(e) {};
        users.today[i] = userTimestamps;
    }

    writeUsers(users)

    let inServer = Object.keys(users).filter(uid => guild.members.get(uid))
    let sorted = inServer.sort((a, b) => users[b] - users[a])
    let topten = sorted.slice(0, 10);

    let leaderboard = [];
    for (var i in topten) {
      let id = topten[i];
      leaderboard.push([":cyclone:", ":diamond_shape_with_a_dot_inside:", ":large_blue_diamond:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"][i] + " \`" + users[id] + "\` <@" + id + ">")
    }

    guild.channels.get("581901184709820446").fetchMessage("581901561790332928").then(msg => msg.edit("Live voting leaderboard, updates every minute.", {
      embed: {
        author: {
          name: "Countr Voting Leaderboard",
          icon_url: guild.members.get("467377486141980682").user.displayAvatarURL
        },
        description: leaderboard.join("\n"),
        color: 0x7289DA
      }
    }))
  }, 60000) // every minute
} 