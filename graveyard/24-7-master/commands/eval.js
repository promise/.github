module.exports = {
  description: "Run JavaScript code. DANGEROUS!",
  usage: {
    "<code ...>": "The code you want to run."
  },
  examples: {},
  aliases: [],
  permissionRequired: 4,
  checkArgs: (args) => {
    return !!args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let code = args.join(" ");
  try {
      let evaled = eval(code);
      if (typeof evaled != "string") evaled = require("util").inspect(evaled);

      message.channel.send("🆗 Evaluated successfully.\n\`\`\`js\n" + evaled + "\`\`\`");
  } catch (e) {
      message.channel.send("🆘 Oops...\n\`\`\`fix\n" + clean(e) + "\`\`\`");
  }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}