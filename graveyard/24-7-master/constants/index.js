module.exports.emojis = {
  "tickYes": "<:tickYes:521319851591991296>",
  "tickNo": "<:tickNo:521319862123888646>",
  "loading": "<a:loading:557611877706760222>",
  "online": "<:online:607315476791689266>",
  "idle": "<:idle:607315476745420821>",
  "dnd": "<:dnd:607315476665729089>"
}

module.exports.colors = {
  "ok": 0x43B581,
  "err": 0xF04747,
  "warn": 0xFAA61A,
}

module.exports.linkCategories = {
  // NEGATIVE
  101: 'MALWARE_OR_VIRUS',
  102: 'POOR_CUSTOMER_EXPERIENCE',
  103: 'PHISHING',
  104: 'SCAM',
  105: 'POTENTIALLY_ILLEGAL',

  // QUESTIONABLE
  201: 'MISLEADING_CLAIMS_OR_UNETHICAL',
  202: 'PRIVACY_RISKS',
  203: 'SUSPICIOUS',
  204: 'HATE_DISCRIMINATION',
  205: 'SPAM',
  206: 'PUP',
  207: 'ADS_POPUPS',

  // NEUTRAL
  301: 'ONLINE_TRACKING',
  302: 'ALTERNATIVE_OR_CONTROVERSIAL_NATURE',
  303: 'OPINIONS_RELIGION_POLITICS',
  304: 'OTHER',

  // CHILD_SAFETY
  401: 'ADULT_CONTENT',
  402: 'INCIDENTAL_NUDITY',
  403: 'GRUESOME_OR_SHOCKING',
  404: 'SITE_FOR_KIDS',

  // POSITIVE
  501: 'GOOD_SITE',

  Meta: {
    NEGATIVE: 100,
    QUESTIONABLE: 200,
    NEUTRAL: 300,
    CHILD_SAFETY: 400,
    POSITIVE: 500,
  },
}

module.exports.getLists = () => ({
  blacklist: require("fs").readFileSync("./constants/url-blacklist.txt", "utf8").split("\n"),
  whitelist: require("fs").readFileSync("./constants/url-whitelist.txt", "utf8").split("\n")
})