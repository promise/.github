const Discord = require("discord.js"), fs = require("fs"), config = require("./config.json"), constants = require("./constants"), catalog = require("./guilds/catalog.json")

const client = new Discord.Client({ disableEveryone: true, disabledEvents: ["TYPING_START"], fetchAllMembers: true });
client.setMaxListeners(999999999) // never do this. It's an experimental bot, never do this in production.

client.once("ready", async () => {
  console.log("Ready as " + client.user.tag);
  client.user.setPresence({ status: "idle", game: { name: "the loading screen", type: "WATCHING" }})

  setTimeout(() => {
    console.log("Starting guild modules ...")
    for (const gname in catalog) fs.readdir("./guilds/" + gname, (err, files) => {
      if (err) console.error(err);
      for (const file of files) if (file.endsWith(".js")) require("./guilds/" + gname + "/" + file).initiate(client, client.guilds.get(catalog[gname]), config, constants)
    })
  }, 15000)
})

setInterval(async () => {
  if (!client.guilds.size) return; // client is not ready yet, or have lost connection
  client.user.setPresence({ status: "online", game: { name: "promise.solutions", type: "WATCHING" }})
}, 60000)

const commands = { guilds: {} } // { "command": require("that_command"), "guilds": { "100101010": { "command": require("that_command") }}}
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  for (var file of files) if (file.endsWith(".js")) {
    let commandFile = require("./commands/" + file)
    commands[file.replace(".js", "")] = commandFile
    if (commandFile.aliases) for (var alias of commandFile.aliases) commands[alias] = commandFile
  }
  console.log("Cached " + files.filter(f => f.endsWith(".js")).length + " global commands.")
})

for (const gname in catalog) fs.readdir("./guilds/" + gname + "/commands/", (err, files) => {
  if (err) console.error(err);
  commands.guilds[catalog[gname]] = {}
  for (const file of files) if (file.endsWith(".js")) {
    let commandFile = require("./guilds/" + gname + "/commands/" + file)
    commands.guilds[catalog[gname]][file.replace(".js", "")] = commandFile
    if (commandFile.aliases) for (var alias of commandFile.aliases) commands.guilds[catalog[gname]][alias] = commandFile
  }
  console.log("Cached " + files.filter(f => f.endsWith(".js")).length + " commands for guild " + gname + ".")
})

client.on("message", async message => {
  if (!message.guild || message.author.bot) return;
  
  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
    if (!message.member && message.author.id) try { message.member = await message.guild.fetchMember(message.author.id, true) } catch(e) {} // on bigger bots with not enough ram, not all members are loaded in. So if a member is missing, we try to load it in.
    
    const args = message.content.split(" ");
    if (args[0].match(`^<@!?${client.user.id}>`)) args.shift(); else args[0] = args[0].slice(config.prefix.length);
    const command = args.shift().toLowerCase()

    let commandFile = commands[command], permissionLevel = getPermissionLevel(message.member)
    if (commands.guilds[message.guild.id] && commands.guilds[message.guild.id][command]) commandFile = commands.guilds[message.guild.id][command];
    if (commandFile) {
      if (permissionLevel < commandFile.permissionRequried) return message.channel.send("❌ You don't have permission! For help type `" + config.prefix + "help " + command + "`.");
      if (commandFile.checkArgs(args) !== true) return message.channel.send("❌ " + (commandFile.checkArgs(args) || "Invalid arguments.") + " For help type `" + config.prefix + "help " + command + "`.");
      
      commandFile.run(client, message, args, permissionLevel, config, constants)
    }
  } else if (message.content.match(`^<@!?${client.user.id}>`)) return message.channel.send("👋 My prefix is `" + config.prefix + "`, for help type `" + config.prefix + "help`.");
})

let getPermissionLevel = (member) => {
  if (config.owner == member.user.id) return 4;
  if (member.guild.owner.id == member.id) return 3;
  if (member.hasPermission("MANAGE_GUILD")) return 2;
  if (member.hasPermission("MANAGE_MESSAGES")) return 1;
  return 0;
}

client
  .on("rateLimit", rl => console.log("Rate limited. [" + rl.timeDifference + "ms, endpoint: " + rl.path + "]"))
  .on("disconnect", dc => console.log("Disconnected:", dc))
  .on("reconnecting", () => console.log("Reconnecting..."))
  .on("resume", replayed => console.log("Resumed. [" + replayed + " events replayed]"))
  .on("error", err => console.log("Unexpected error:", err))
  .on("warn", warn => console.log("Unexpected warning:", warn))
  .login(config.token)