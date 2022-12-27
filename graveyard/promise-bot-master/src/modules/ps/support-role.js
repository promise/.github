module.exports = client => {
  client.on("guildMemberUpdate", (_, member) => {
    if ([
      "545584317481353228", // Sponsor
      "513820998362202122", // $5 Patron (legacy)
      "638989701730140161", // Nitro Booster
      "510936252019638282", // $3 Patron (legacy)
      "510935895885611010", // $1 Premium
      "496237757216325633", // Blurple Supporter
    ].find(roleid => member.roles.cache.has(roleid))) {
      if (!member.roles.cache.has("662049690438598666")) member.roles.add("662049690438598666");
    } else {
      if (member.roles.cache.has("662049690438598666")) member.roles.remove("662049690438598666");
    }
  })
};