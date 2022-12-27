module.exports = {
  description: "Play rock-paper-scissors with the bot",
  usage: {
    "<choice: rock|paper|scissors>": "Your choice!"
  },
  examples: {},
  aliases: [ "rps" ],
  permissionRequired: 0,
  checkArgs: (args) => {
    return args.length == 1;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let choice = args[0] ? args[0].toLowerCase().replace("scissors", "scissor") : ["rock", "paper", "scissor"][Math.floor(Math.random() * 3)];
  if (!["rock", "paper", "scissor"].includes(choice)) return message.channel.send(":x: " + (eggs[choice] || "Invalid object, please choose between rock, paper and scissor."));

  let botChoice = ["rock", "paper", "scissor"][Math.floor(Math.random() * 3)];
  if (eaters[choice] == botChoice) return message.channel.send("🔆 You won! :(")
  if (eaters[botChoice] == choice) return message.channel.send("💮 You lost! >:)")
  return message.channel.send("✴ It's a tie!")
}

const eggs = {
  "gun": "No guns allowed!",
  "lizard": "Lizards are banned.",
  "spock": "Wrong game.",
}, eaters = {
  "rock": "scissor",
  "paper": "rock",
  "scissor": "paper"
}