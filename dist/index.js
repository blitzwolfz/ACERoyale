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
const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
var _server = http.createServer(app);
const client = new Discord.Client();
app.get('/', (_request, response) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
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
            console.log(match.p1.voters);
            console.log(match.p2.voters);
            let id = (_a = client.channels.get(messageReaction.message.channel.id)) === null || _a === void 0 ? void 0 : _a.id;
            if (match.channelid === id) {
                if (messageReaction.emoji.name === "🅱️") {
                    if (!match.p2.voters.includes(user.id)) {
                        match.p2.votes += 1;
                        match.p2.voters.push(user.id);
                    }
                    else if (match.p1.voters.includes(user.id)) {
                        match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1);
                        match.p2.votes += 1;
                        match.p1.votes -= 1;
                        match.p2.voters.push(user.id);
                    }
                    await messageReaction.remove(user.id);
                    await messageReaction.message.react("🅱️");
                }
                else if (messageReaction.emoji.name === "🅰️") {
                    if (!match.p1.voters.includes(user.id)) {
                        match.p1.votes += 1;
                        match.p1.voters.push(user.id);
                    }
                    else if (match.p2.voters.includes(user.id)) {
                        match.p2.voters.splice(match.p2.voters.indexOf(user.id), 1);
                        match.p1.votes += 1;
                        match.p2.votes -= 1;
                        match.p1.voters.push(user.id);
                    }
                    await messageReaction.remove(user.id);
                    await messageReaction.message.react("🅱️");
                }
            }
        }
    }
});
client.on("message", async (message) => {
    var _a;
    if (message.author.bot) {
        return;
    }
    const prefix = config.prefix;
    console.log(matches);
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
