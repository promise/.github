const fetch = require("node-fetch");

const monitors = {
  "@DeepQuotesBot": "I have had a lot of breakdowns in my life, even as a teenager (yes, I'm a teenager) so I made a Twitter bot, trying to give your day a bit of spark. You can follow the twitter here: [https://twitter.com/@DeepQuotesBot](https://twitter.com/@DeepQuotesBot). The source code is private.",
  "@OutageDiscord": "Some code behind a twitter handle letting you know if Discord is having issues. You can follow the twitter here: [https://twitter.com/@OutageDiscord](https://twitter.com/@OutageDiscord). The source code is private.",
  "Countr": "A Discord counting bot that can manage a simple counting channel in your guild! Fits all guilds (pretty much) and has easy setup. Example in <#467378104172806164>. [Click here for individual shard status.](https://uptime.countr.xyz/) The source code can be found [here](https://github.com/promise-solutions/countr).",
  "Nevrevr": "A \"Never Have I Ever\" bot with a voting system and over 500+ different questions in multiple categories. The bot does not accept servers due to server capacity, but the source can be found [here](https://github.com/promise-solutions/nevrevr).",
  "Promise 24/7": "My assistant, helping me out with support tickets, gatekeeper things etc. The source code is private.",
  "Voicr": "A bot that gives a role upon joining a voice channel! The bot does not accept servers due to server capacity, but the source can be found [here](https://github.com/promise-solutions/voicr)."
}

module.exports.initiate = async (client, guild, config, constants) => {
  let channel = guild.channels.get("593856341093646336"), pinned = await channel.fetchPinnedMessages(), message;
  if (pinned.array().length) message = pinned.first(); else message = await channel.send("Initializing...").then(m => { m.pin(); message });
  
  setInterval(async () => {
    let uptimerobot = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      }, body: ["api_key=" + config.uptimerobotapikey, "format=json", "logs=1", "response_times=1"].join("&")
    }).then(res => res.json());
    
    let embeds = []
    
    for (var m in monitors) {
      let mon = uptimerobot.monitors.find(monitor => monitor.friendly_name == m);
      if (mon) {
        let embed = {
          title: mon.friendly_name + " [" + ["Paused", "Starting up", "Online", 0, 0, 0, 0, 0, "Seems offline", "Offline"][mon.status] + "] [" + mon.average_response_time + "ms]",
          url: "https://uptime.promise.solutions/" + mon.id,
          description: monitors[m],
          color: [0x17252E, 0x006DCC, 0x80BA27, 0x0, 0x0, 0x0, 0x0, 0x0, 0xEDC240, 0xFF0000][mon.status],
          timestamp: new Date(),
          footer: {
            text: mon.id
          },
          fields: []
        }
        
        let rawLogs = mon.logs.filter(l => [1, 2].includes(l.type) && new Date(l.datetime * 1000).getTime() > new Date().getTime() - 86400000);
        
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
        
        embeds.push(embed)
      }
    }
    
    let messages = await channel.fetchMessages({ limit: 100 })
    for (var i in embeds) {
      let msg = messages.find(m => m.embeds[0] && m.embeds[0].footer.text == embeds[i].footer.text);
      if (!msg) msg = await channel.send("Loading uptime status...")
      await msg.edit({embed: embeds[i]})
    }
    
    pinned.first().edit({embed: {
      title: "Uptime Monitors",
      url: "https://uptime.promise.solutions",
      description: "This is simply a copy of https://uptime.promise.solutions/ - just on Discord. This will show all my projects (even some you might not know about) and their statutes.",
      color: 0x7289da,
      timestamp: new Date(),
      footer: {
        text: "Powered by UptimeRobot, last updated"
      }
    }})
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