const
  Discord = require("discord.js"),
  fs = require("fs"),
  config = require("../config.json"),
  commandHandler = require("./handlers/commands.js"),
  slashCommandHandler = require("./handlers/slashCommands.js"),
  client = new Discord.Client({
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    disableMentions: "everyone",
    partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
    presence: {
      status: "online",
      activity: {
        type: "WATCHING",
        name: "promise.solutions"
      }
    },
    ws: {
      intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS" ]
    },
    fetchAllMembers: true
  });

client.on("shardReady", () => {
  console.log(`Ready as ${client.user.tag}!`);

  // slash commands
  slashCommandHandler(client).then(() => console.log("Slash Commands have been set up."));

  // custom files
  getFilesInDir("./src/modules").then(files => files.filter(file => typeof file == "function").forEach(file => file(client)));
});

client.on("message", async message => {
  if (
    !message.guild ||
    message.author.bot ||
    message.type !== "DEFAULT"
  ) return;

  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) return commandHandler(message);
  else if (message.content.match(`^<@!?${client.user.id}>`)) return message.channel.send(`👋 My prefix is \`${config.prefix}\`, for help type \`${config.prefix}help\`.`);
});

const getFilesInDir = path => new Promise(resolve => fs.readdir(path, "utf-8", async (_, files) => {
  const newFiles = [];
  for (const file of files) {
    if (!file.includes(".")) newFiles.push(...await getFilesInDir(`${path}/${file}`));
    else if (file.endsWith(".js")) newFiles.push(require(`.${path}/${file}`));
  }
  resolve(newFiles);
}));

client
  .on("error", err => console.log("Client error.", err))
  .on("rateLimit", rateLimitInfo => console.log("Rate limited.", JSON.stringify(rateLimitInfo)))
  .on("warn", info => console.log("Warning.", info))
  .login(config.token);