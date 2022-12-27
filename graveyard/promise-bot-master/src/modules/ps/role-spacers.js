// SPACER NAME: ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// SPACER COLOR: 18191c
// Any role that has the name will work, but the color makes it only show as a white line.

const spacerName = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", processing = new Set();

module.exports = async client => {
  client.on("guildMemberUpdate", (_, member) => {
    if (member.guild.id == "449576301997588490") changeSpacers(member);
  });
  const members = await client.guilds.cache.get("449576301997588490").members.fetch();
  for (const member of members.array()) await changeSpacers(member);
};

async function changeSpacers(member) {
  if (processing.has(member.id)) return;
  else processing.add(member.id);

  let
    memberRoles = member.roles.cache.filter(r => r.name !== spacerName && r.name !== "@everyone").sort((ar, br) => br.position - ar.position),
    allSpacers = member.guild.roles.cache.filter(r => r.name == spacerName).sort((ar, br) => ar.position - br.position).array(),
    shouldHave = [],
    prev = 0;
  for (const spacer of allSpacers) {
    let role = memberRoles.find(r => prev < r.position && r.position < spacer.position);
    if (role) shouldHave.push(spacer.id);
    prev = spacer.position;
  }

  if (!member.user.bot) shouldHave.pop();

  let addSpacers = allSpacers.filter(spacer => shouldHave.includes(spacer.id) && !member.roles.cache.has(spacer.id));
  if (addSpacers.length) await member.roles.add(addSpacers);

  let removeSpacers = allSpacers.filter(spacer => !shouldHave.includes(spacer.id) && member.roles.cache.has(spacer.id));
  if (removeSpacers.length) await member.roles.remove(removeSpacers);

  return processing.delete(member.id);
}
