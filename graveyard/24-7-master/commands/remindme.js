module.exports = {
  description: "Remind me of something, using IFTTT",
  usage: {
    "[<due> |]": "Add a due date, will default to today.",
    "<task ...>": "The task you want to add."
  },
  examples: {
    "tomorrow | Clean my room": "Will remind you tomorrow to clean your room."
  },
  aliases: [ "addtask" ],
  permissionRequired: 4,
  checkArgs: (args) => {
    return !!args.length;
  }
}

module.exports.run = async (client, message, args, permissionLevel, config, constants) => {
  let due = args.join(" ").split(" | ")[0]
  
  let task = args.join(" ").split(" | ")[1] || due;
  if (due == task) due = "today";
  
  await fetch('https://maker.ifttt.com/trigger/add_task/with/key/' + config.iftttkey, {
    method: "POST",
    body: JSON.stringify({ value1: task, value2: due }),
    headers: { 'Content-Type': 'application/json' }
  })
  
  message.channel.send(":white_check_mark: Added to your Task inbox and to your calendar.")
}