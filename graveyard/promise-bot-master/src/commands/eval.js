module.exports = {
  help: "<code ...>",
  permissionRequired: 4,
  checkArgs: args => !!args.length
};

module.exports.run = async (message, _, { content }) => {
  try {
    let evaled = await eval(content);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    
    message.channel.send(`🆗 Evaluated successfully.\n\`\`\`js\n${evaled}\`\`\``);
  } catch(e) {
    let err;
    if (typeof e == "string") err = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else err = e;
    message.channel.send(`🆘 JavaScript failed.\n\`\`\`fix\n${err}\`\`\``);
  }
};