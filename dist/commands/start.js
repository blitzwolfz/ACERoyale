"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord = __importStar(require("discord.js"));
const utils_1 = require("../misc/utils");
const config_json_1 = require("../misc/config.json");
async function start(message, client, matches) {
    let users = [];
    var args = message.content.slice(config_json_1.prefix.length).trim().split(/ +/g);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `.start @user1 @user2 template`");
    }
    for (let i = 0; i < args.length; i++) {
        let userid = await utils_1.getUser(args[i]);
        if (userid) {
            users.push(userid);
        }
    }
    let user1 = (await client.fetchUser(users[0]));
    let user2 = (await client.fetchUser(users[1]));
    let newmatch = {
        channelid: message.channel.id,
        p1: {
            userid: user1.id,
            username: user1.username,
            memedone: false,
            time: 30,
        },
        p2: {
            userid: user2.id,
            username: user2.username,
            memedone: false,
            time: 30
        },
        votetime: Date.now(),
    };
    let embed = new discord.RichEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.Attachment("testtemp.png");
        message.channel.send("Here is your template:");
        message.channel.send(att);
    }
    matches.push(newmatch);
    return matches;
}
exports.start = start;
