module.exports.initiate = async (client, guild, config, constants) => {
  client.on("presenceUpdate", (_, member) => member.guild.id == guild.id ? mobile(member) : null)
  client.on("guildMemberAdd", member => member.guild.id == guild.id ? mobile(member) : null)
  for (var member of guild.members.array()) await mobile(member)
  console.log("All members in " + guild.name + " have gotten their presence roles updated.")
}

const mobile = member => new Promise(async (resolve, reject) => {
  if (member.user.bot) return member.addRole("647484663736303626") && resolve();
  else if (member.presence.clientStatus) try {
    if (member.presence.clientStatus.mobile) await member.addRole("613460707286974477").catch(() => null); else await member.removeRole("613460707286974477").catch(() => null);
    if (member.presence.clientStatus.desktop) await member.addRole("613460990528585751").catch(() => null); else await member.removeRole("613460990528585751").catch(() => null);
    if (member.presence.clientStatus.web) await member.addRole("613460905619095633").catch(() => null); else await member.removeRole("613460905619095633").catch(() => null);
  } catch(e) {}
  return resolve();
})