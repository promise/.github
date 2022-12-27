const { testareas } = require("../database");

module.exports = client => {
  client.on("voiceStateUpdate", async (_, newVoice) => {
    const testarea = await testareas.get(newVoice.guild.id);
    if (testarea && newVoice.channel && newVoice.channel.id == testarea.toggleadmin) {
      if (newVoice.member.roles.cache.has(testarea.adminrole)) newVoice.member.roles.remove(testarea.adminrole);
      else newVoice.member.roles.add(testarea.adminrole);
      newVoice.kick();
    }
  });
};