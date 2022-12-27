module.exports = {
  description: "",
  usage: {},
  examples: {},
  aliases: [],
  permissionRequired: 0,
  checkArgs: (args) => {
    return !!args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let botMsg = await message.channel.send({
    embed: {
      title: "Scanning ...",
      description: "This should only take a couple of seconds.",
      color: constants.colors.warn
    }
  })
  
  scan(args.join(" "), config.wotkey, constants.getLists()).then(result => {
    let embed = {}
    embed.title = "Results from " + args.join(" ")
    embed.color = constants.colors.ok;
    embed.fields = [
      {
        "name": (result.blacklisted ? constants.emojis.tickNo + " URL is blacklisted." : constants.emojis.tickYes + " URL is not blacklisted."),
        "value": "The blacklist is set globally on the entire bot. Threats towards Discord will be added to the blasklist whenever we hear about them.",
        "inline": true
      }
    ]
    
    if (result.trustworthy && result.trustworthy[1] >= 10) embed.fields.push({
      "name": (result.trustworthy[0] < 75 ? constants.emojis.tickNo + " Website is not trustworthy." : constants.emojis.tickYes + " Website is trustworthy."),
      "value": "Based on **" + result.trustworthy[1] + " ratings** from real-life humans, the site is **" + result.trustworthy[0] + "%** trustworthy."
    })
    
    if (result.childsafe && result.childsafe[1] >= 10) embed.fields.push({
      "name": (result.childsafe[0] < 75 ? constants.emojis.tickNo + " Website is not child safe." : constants.emojis.tickYes + " Website is child safe."),
      "value": "Based on **" + result.childsafe[1] + " ratings** from real-life humans, the site is **" + result.childsafe[0] + "%** child safe."
    })
    
    if (result.wot) {
      let wot = []
      for (var id in result.wot) wot.push(constants.linkCategories[id] + ": " + result.wot[id] + "%")
      if (wot.length) embed.description = "```" + wot.join(", ") + "```"
    }
    
    if (result.youtube) {
      embed.fields.push({
        "name": (result.youtube.blocked.length > 0 ? constants.emojis.tickNo : constants.emojis.tickYes) + " YouTube Restrictions",
        "value": "\`" + result.youtube.title + "\` (" + result.youtube.id + ")\nThis video is blocked in " + result.youtube.blocked.length + " countries." + (result.youtube.blocked.length > 0 ? "\n" + result.youtube.blocked.map(c => ":flag_" + c.toLowerCase() + ":").join(" ") : "")
      })
    }
    
    if (result.whitelisted) {
      embed.fields = [];
      embed.description = constants.emojis.tickYes + " **This link is whitelisted.** This may be because the link has multiple bad ratings, but is still a good site."
    }
    
    botMsg.edit({ embed })
  })
}

const fetch = require("node-fetch");
const getVideo = require("get-video-id");

const scan = (rawLink, wotkey, { whitelist, blacklist }) => new Promise((resolve, reject) => {
  let link = rawLink.replace("http://", "").replace("https://", "").split("/")[0];
  let result = {
    "whitelisted": false,
    "blacklisted": false,
    "hsts": true,
    "trustworthy": null,
    "childsafe": null,
    "youtube": null,
    "wot": {}
  };
                                
  if (whitelist.includes(link)) {
    result.whitelisted = true;
  }
  
  if (blacklist.includes(link)) result.blacklisted = true;
  
  Promise.all([ new Promise(done => {
    fetch("https://hstspreload.org/api/v2/status?domain=" + link).then(res => res.json()).then(hsts => {
      if (hsts.status != "preloaded") result.hsts = false;
      done()
    }).catch(done)
  }), new Promise(done => {
    fetch("https://api.mywot.com/0.4/public_link_json2?hosts=" + link + "/&key=" + wotkey).then(res => res.json()).then(wotRaw => {
      let wot = wotRaw[Object.keys(wotRaw)[0]];
      if (wot) {
        if (wot[0]) result.trustworthy = wot[0]; // is the site trustworthy?
        if (wot[4]) result.childsafe = wot[4]; // is the site child safe?
        if (wot.categories) result.wot = wot.categories;
      }
      done()
    }).catch(done)
  }), new Promise(done => {
    let video = getVideo(rawLink);

    if (video.service == "youtube") fetch("https://api.unblockvideos.com/youtube_restrictions?id=" + video.id).then(res => res.json()).then(_ => {
      result.youtube = _[0];
      done()
    }); else done()
  })]).then(() => resolve(result))
})