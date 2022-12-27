const fetch = require("node-fetch");

const mons = {
  main: "The main monitor. If this is down, the entire bot is (probably) down.\nCountr has {{SHARDS}} shards, powering {{GUILDS}} guilds and {{USERS}} users.",
  shard: "Shard {{SHARD}} of Countr. Keeps an eye on {{GUILDS}} guilds and {{USERS}} users.",
  premium: "Premium version of the bot. Countr Premium is much more stable, and have some premium features as well. Go check it out at [/premium](https://countr.xyz/premium)."
}
  
module.exports.initiate = async (client, guild, config, constants) => {
  let channel = guild.channels.get("597454596771676166")
  
  setInterval(async () => {
    let uptimerobot = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }, body: ["api_key=" + config.uptimerobotapikey, "format=json", "logs=1", "response_times=1"].join("&")
    }).then(res => res.json())
    
    let galaxygate = await fetch("https://host.countr.xyz/").then(res => res.json())
    
    let monitors = uptimerobot.monitors.filter(m => m.friendly_name.startsWith("Countr"));
    
    let embeds = []
    
    for (var mon of monitors) {
      let shard = parseInt(mon.friendly_name.replace("Countr Shard ", "")), shardInfo = {
        guilds: galaxygate.shards ? galaxygate.shards["SHARD_" + shard] ? galaxygate.shards["SHARD_" + shard].guilds : 0 : 0,
        users: galaxygate.shards ? galaxygate.shards["SHARD_" + shard] ? galaxygate.shards["SHARD_" + shard].users : 0 : 0
      }, embed = {
        title: mon.friendly_name + " [" + ["Paused", "Starting up", "Online", 0,0,0,0,0, "Seems offline", "Offline"][mon.status] + "] [" + mon.average_response_time + "ms]",
        url: "https://uptime.countr.xyz/" + mon.id,
        description: mon.friendly_name.includes("Shard") ? mons.shard.replace("{{SHARD}}", shard).replace("{{GUILDS}}", shardInfo.guilds).replace("{{USERS}}", shardInfo.users) : mon.friendly_name.includes("Premium") ? mons.premium : mons.main.replace("{{SHARDS}}", Object.keys(galaxygate.shards).length).replace("{{GUILDS}}", galaxygate.guilds).replace("{{USERS}}", galaxygate.users),
        color: [0x17252E, 0x006DCC, 0x80BA27, 0,0,0,0,0, 0xEDC240, 0xFF0000][mon.status],
        timestamp: new Date(),
        footer: {
          text: mon.id
        },
        fields: []
      }
      
      let rawLogs = mon.logs.filter(l => [1, 2].includes(l.type) && new Date(l.datetime * 1000).getTime() > new Date().getTime() - 86400000);
      let newLogs = []

      for (var i in rawLogs) {
        let log = rawLogs[i];
        if (i == 0 && log.type == 1) { // service is currently down
          embed.fields.push({
            name: "Currently down",
            value: "Service has been down for " + formatTime(log.duration) + "."
          })
        } else if (log.type == 1) { // service has been down
          let pLog = rawLogs[i - 1]
          embed.fields.push({
            name: "Downtime " + formatTime((new Date().getTime() - new Date(pLog.datetime * 1000).getTime()) / 1000) + " ago",
            value: "The downtime lasted " + formatTime(log.duration) + ".",
            inline: true
          })
        }
      }
      
      embeds.push(embed);
    }
    
    let messages = (await channel.fetchMessages({ limit: 100 })).filter(m => m.author.id == client.user.id && m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text)
    for (var i in embeds) {
      let msg = messages.find(m => m.embeds[0] && m.embeds[0].footer.text == embeds[i].footer.text);
      if (!msg) msg = await channel.send("Loading uptime status...")
      await msg.edit({embed: embeds[i]})
    }
  }, 60000)
}

function formatTime(totalSeconds, secs = false) {
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let timeArray = [];
  if (days) timeArray.push(days + "d");
  if (hours) timeArray.push(hours + "h");
  if (minutes) timeArray.push(minutes + "m");
  if ((seconds && secs) || timeArray.length == 0) timeArray.push(seconds + "s")
    
  return timeArray.join("");
}