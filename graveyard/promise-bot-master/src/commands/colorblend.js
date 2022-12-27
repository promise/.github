module.exports = {
  help: "<first color> <second color> <nickname>",
  permissionRequired: 0,
  checkArgs: (args) => {
    return args.length >= 3;
  }
};

module.exports.run = async (message, args) => {
  let
    color1 = args.shift(),
    color2 = args.shift(),
    nickname = args.join(" "),
    length = nickname.length - 1, // first one is already generated

    color1Parts = [[0,1],[2,3],[4,5]].map(part => parseInt(part.map(i => color1[i]).join(""), 16)),
    color2Parts = [[0,1],[2,3],[4,5]].map(part => parseInt(part.map(i => color2[i]).join(""), 16)),

    colorPoints = [
      [ color1Parts[0] ], // r
      [ color1Parts[1] ], // g
      [ color1Parts[2] ] // b
    ],

    newNickname = "";
  
  for (let index = 0; index < length; index++) {
    let
      i = index + 1,
      newColorParts = color1Parts.map((_, cpIndex) => {
        let
          color1Part = color1Parts[cpIndex],
          color2Part = color2Parts[cpIndex],
          diff = color2Part - color1Part;
        return Math.round(color1Part + (diff / length * i));
      });
    for (const i in newColorParts) colorPoints[i].push(newColorParts[i]);
  }

  for (const i in nickname) newNickname = newNickname + "&#" + numToDoubleHex(colorPoints[0][i]) + numToDoubleHex(colorPoints[1][i]) + numToDoubleHex(colorPoints[2][i]) + nickname[i];

  message.channel.send("✅ `" + newNickname + "`");
};

const numToDoubleHex = num => {
  let hex = num.toString(16);
  if (hex.length == 1) return "0" + hex;
  else return hex;
};