[![Discord](https://img.shields.io/discord/449576301997588490.svg?label=Discord&logo=discord)](https://discord.gg/pfQz5Pq)
[![David](https://img.shields.io/david/Gleeny/Discord-Discord-RPC.svg?logo=javascript&logoColor=white)](https://david-dm.org/Gleeny/Discord-Discord-RPC)
[![GitHub Issues](https://img.shields.io/github/issues/Gleeny/Discord-Discord-RPC.svg?logo=github&logoColor=white)](https://github.com/Gleeny/Discord-Discord-RPC/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Gleeny/Discord-Discord-RPC.svg?logo=github&logoColor=white)](https://github.com/Gleeny/Discord-Discord-RPC/commit/master)
[![License](https://img.shields.io/github/license/Gleeny/Discord-Discord-RPC.svg?label=License&logo=github&logoColor=white)](./LICENSE)

# Discord-Discord-RPC

Discord Discord RPC is a RPC client that show the channel, user or group you're talking to. You don't want people to think you have secrets, do you?

## Tutorial

1. Fork/download this project to your computer.
2. Go to [the Applications-page](https://discordapp.com/developers/applications/) and make a new application. The name should be whatever you want to be in the status, ex. if I want it to say "Playing Ban Hammer", I name the application "Ban Hammer". No worries, it can be changed whenever you want.
3. Go to the tab called Rich Presence > Art Assets. Scroll down and add images you would like to be displayed on the RPC. Make sure to give them names! (See #Image Reference)
4. **Copy** (don't delete or rename) `config.json.example` and rename it to `config.json`
5. Change the properties of the configuration. (See #Configuration)

## Image Reference

![Image Reference](https://i.imgur.com/OdYYRfa.png)

## Configuration

`*` = anywhere in the config

- `appid` The application ID. `string`
- `interval` Delay in seconds it will update. If you're experiencing lag, you might want to bump this up. `number`
- `...discord.details` What it will display in the RP when chatting in a group, channel or to a user. `array.string`
- `...sleep.details` Some text it will display in the RP when sleeping. `string`
- `...sleep.state` Additional text when sleeping. `string`
- `*.largeImageKey` Name of the large image you want. `string`
- `*.largeImageText` Text you want to show when hovering over the large image `string`
- `*.smallImageKey` Name of the small image you want. `string`
- `*.smallImageText` Text you want to show when hovering over the small image. `string`
- `*.startTimestamp` Display time since the RPC updated. `true/false`
- `*.endTimestamp` Display time until the current task (ex. sleeping) is done. `true/false`
- `*.joinButton` Display a "Ask to Join"-button that's greyed out (since it's not a game). `true/false`
- `*.spectateButton` Same as above, just as a "Spectate"-button. `true/false`
- `sleepTime` When you go to sleep. (See #Sleep Times)

## Sleep Times

```elixir
"sleepTime": [
        [ 22, 7  ],
        [ 22, 7  ],
        [ 22, 7  ],
        [ 22, 7  ],
        [ 22, 7  ],
        [ 23, 10 ],
        [ 23, 10 ]
    ]
```

Each array is it's own day, first is Monday, last is Sunday etc etc. My schedule is like this;

I go to bed at 22pm if there's work tomorrow, and wake up 7am. If it's not work tomorrow, I go to bed at 23pm and wake up the next day 10am.

It's very weird set up right now, this is an old RPC I've been using for months now. If you want to fix it, please PR.
