const spacerName = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", spacerKeyword = "SPACER", spacerColor = 0x2F3136;

module.exports.initiate = async (client, guild, config, constants) => {
  client.on("guildMemberUpdate", (old, member) => member.guild.id == guild.id ? changeSpacers(member) : null).on("roleUpdate", (_, role) => { if (role.guild.id !== guild.id) return;
    if (role.name == spacerKeyword) role.edit({ name: spacerName, color: spacerColor, permissions: 0 }, "Spacer created.")
  })
  for (var member of guild.members.array()) await changeSpacers(member);
  console.log("All members in " + guild.name + " have gotten their spacers updated.")
}

async function changeSpacers(member) {
  let memberRoles = member.roles.filter(r => r.name !== spacerName && r.name !== "@everyone").sort((ar, br) => br.calculatedPosition - ar.calculatedPosition)

  let allSpacers = member.guild.roles.filter(r => r.name == spacerName).sort((ar, br) => ar.calculatedPosition - br.calculatedPosition).array(), shouldHave = [], prev = 0;
  for (var s of allSpacers) {
    let role = memberRoles.find(r => prev < r.calculatedPosition && r.calculatedPosition < s.calculatedPosition)
    if (role) shouldHave.push(s.id)
    prev = s.calculatedPosition
  }
  if (!member.user.bot) shouldHave.pop();

  for (var spacer of allSpacers) {
    if (shouldHave.includes(spacer.id) && !member.roles.get(spacer.id)) await member.addRole(spacer);
    else if (!shouldHave.includes(spacer.id) && member.roles.get(spacer.id)) await member.removeRole(spacer);
  }

  return;
}