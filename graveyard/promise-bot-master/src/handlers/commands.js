const { getPermissionLevel } = require("../constants"), fs = require("fs"), config = require("../../config.json");

module.exports = async message => {
  let content;
  if (message.content.match(`^<@!?${message.client.user.id}> `)) content = message.content.split(" ").slice(1);
  else content = message.content.slice(config.prefix.length).split(" ");
  const commandOrAlias = content.shift().toLowerCase(), commandName = aliases.get(commandOrAlias) || commandOrAlias;
  content = content.join(" ");

  const static = statics.find(s => s.triggers.includes(commandName));
  if (!static && !commands.has(commandName)) return;

  if (static) return message.channel.send(static.message.replace(/{{BOT_ID}}/g, message.client.user.id));

  const commandFile = commands.get(commandName);

  const permissionLevel = getPermissionLevel(message.member);
  if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this.");

  const args = (content.match(/"[^"]+"|[^ ]+/g) || []).map(arg => arg.startsWith("\"") && arg.endsWith("\"") ? arg.slice(1).slice(0, -1) : arg);
  if (!commandFile.checkArgs(args, permissionLevel)) return message.channel.send(`❌ Invalid usage. \`${config.prefix}${commandName}${commandFile.help ? ` ${commandFile.help}` : ""}\``);

  return commandFile.run(message, args, { permissionLevel, content });
};

// loading commands
const commands = new Map(), aliases = new Map(), statics = require("../commands/_static.json");
fs.readdir("./src/commands/", (err, files) => {
  if (err) return console.log(err);
  for (const file of files) if (file.endsWith(".js")) loadCommand(file.replace(".js", ""));
});

const loadCommand = fileName => {
  const commandFile = require(`../commands/${fileName}.js`);
  if (!commandFile.premiumOnly || config.isPremium) {
    commands.set(fileName, commandFile);
    if (commandFile.aliases) for (const alias of commandFile.aliases) aliases.set(alias, fileName);
  }
};

module.exports.reloadCommand = command => {
  delete require.cache[require.resolve(`../commands/${command}.js`)];
  loadCommand(command);
};

module.exports.reloadStaticCommands = () => {
  delete require.cache[require.resolve("../commands/_static.json")];
  const newStatics = require("../commands/_static.json");
  statics.length = 0; // remove everything from the variable
  statics.push(...newStatics); // add new data to same variable
};