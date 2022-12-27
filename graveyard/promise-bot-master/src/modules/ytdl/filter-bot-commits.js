module.exports = client => {
  client.on("message", async message => {
    if (
      message.channel.id == "484843453969203200" &&
      message.embeds[0].author.name.endsWith("[bot]") &&
      message.embeds[0].title.includes("new commit")
    ) message.delete();
  });
};