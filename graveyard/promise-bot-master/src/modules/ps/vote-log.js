// Votes are being sent through a webhook to Discord. The webhook message looks like this:
// <userid> @ [<name-of-site>](<link-to-site>)
// an example:
// 110090225929191424 @ [DiscordBots.org](https://discordbots.org/bot/467377486141980682/vote)

const { votelog } = require("../../database"), config = require("../../../config.json");

module.exports = client => {
  const guild = client.guilds.cache.get(config.mainGuild);
  client.on("message", async message => {
    if (message.channel.id == "484811103101255680" && message.webhookID) {
      const [ userid, source ] = message.content.split(" @ "), { total = {}, today = {} } = await votelog.get();

      total[userid] = (total[userid] || 0) + 1;
      today[userid] = [...(today[userid] || []), Date.now() +  86400000]; // time now + 24 hours

      votelog.setMultiple({ total, today });

      const user = await client.users.fetch(userid, false);

      guild.channels.cache.get("581901184709820446").send({
        embed: {
          author: {
            icon_url: user.avatarURL({ dynamic: true, size: 128 }),
            name: user.tag
          },
          color: today[userid].length < 6 ? 7506394 : 5135764, // blurple or dark blurple
          description: "**Thanks for voting @ " + source + "!**",
          footer: {
            text: "📌 See pinned messages, vote and get fancy roles!"
          }
        }
      });
    }
  });

  setInterval(async () => {
    const { today = {}, total = {} } = await votelog.get();

    for (const userid in today) {
      today[userid] = today[userid].filter(ts => ts > Date.now());
      const member = guild.members.cache.get(userid);
      if (member) {
        if (today[userid].length >= 6 && !member.roles.cache.has("510555278580645892")) member.roles.add("510555278580645892", "Vote");
        if (today[userid].length < 6 && member.roles.cache.has("510555278580645892")) member.roles.remove("510555278580645892", "Vote");
        if (today[userid].length >= 1 && !member.roles.cache.has("496237757216325633")) member.roles.add("496237757216325633", "Vote");
        if (today[userid].length < 1 && member.roles.cache.has("496237757216325633")) member.roles.remove("496237757216325633", "Vote");
      }
    }

    votelog.set("today", today);

    const
      members = Object.keys(total).filter(uid => guild.members.cache.has(uid)),
      sorted = members.sort((a, b) => total[b] - total[a]),
      top = sorted.slice(0, 10),
      leaderboard = top.map((id, index) => formatScore(id, index, total)),
      description = leaderboard.join("\n"),
      message = await guild.channels.cache.get("581901184709820446").messages.fetch("581901561790332928");

    return message.edit({
      embed: {
        author: {
          name: "Vote Leaderboard",
          icon_url: guild.iconURL({ dynamic: true, size: 128 })
        },
        description,
        color: 0x7289DA
      }
    });
  }, 5000);
};

const medals = {
  "1st": "🥇",
  "2nd": "🥈",
  "3rd": "🥉"
};

function formatScore(id, index, total) {
  let suffix = formatNumberSuffix(index + 1);
  suffix = medals[suffix] || `**${suffix}**:`;
  return `${suffix} <@${id}>, **score:** ${(total[id] || 0).toLocaleString("en-US")}`;
}

function formatNumberSuffix(number) {
  let str = number.toString();

  if (str == "0") return "N/A";
  if (str.endsWith("11") || str.endsWith("12") || str.endsWith("13")) return str + "th"; // ex. eleventh instead of elevenst
  if (str.endsWith("1")) return str + "st"; // ends on first
  if (str.endsWith("2")) return str + "nd"; // ends on second
  if (str.endsWith("3")) return str + "rd"; // ends on third
  return str + "th"; // ends on fourth, fifth, sixth etc.
}