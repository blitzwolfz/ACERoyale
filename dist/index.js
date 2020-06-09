"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const config = __importStar(require("./misc/config.json"));
const submit_1 = require("./commands/submit");
const start_1 = require("./commands/start");
const winner_1 = require("./commands/winner");
console.log("Hello World, bot has begun life");
const client = new Discord.Client();
client.on('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
let matches = [];
client.on("messageReactionAdd", async function (messageReaction, user) {
    var _a;
    console.log(`a reaction is added to a message`);
    if (user.bot)
        return;
    if (matches) {
        for (const match of matches) {
            let id = (_a = client.channels.get(messageReaction.message.channel.id)) === null || _a === void 0 ? void 0 : _a.id;
            if (match.channelid === id) {
                if (messageReaction.emoji.name === "🅱️") {
                    match.p2.votes += 1;
                    await messageReaction.remove(user.id);
                    await messageReaction.message.react("🅱️");
                }
                else if (messageReaction.emoji.name === "🅰️") {
                    match.p1.votes += 1;
                    await messageReaction.remove(user.id);
                    await messageReaction.message.react("🅰️");
                }
            }
        }
        return;
    }
    else {
        return;
    }
});
client.on("message", async (message) => {
    var _a;
    if (message.author.bot) {
        return;
    }
    const prefix = config.prefix;
    start_1.running(message, matches, client);
    if (message.content.indexOf(prefix) !== 0 || message.author.bot) {
        return;
    }
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!args || args.length === 0) {
        return;
    }
    ;
    const command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!command) {
        return;
    }
    ;
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    else if (command === "submit") {
        submit_1.submit(message, matches);
    }
    else if (command === "start") {
        start_1.start(message, client, matches);
    }
    else if (command === "end") {
        winner_1.endmatch(message, matches, client);
    }
});
client.login(config.token);
