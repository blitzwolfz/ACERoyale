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
        matchdone: false,
        p1: {
            userid: user1,
            username: user1.username,
            memedone: false,
            time: Date.now(),
            memelink: "",
        },
        p2: {
            userid: user2,
            username: user2.username,
            memedone: false,
            time: Date.now(),
            memelink: "",
        },
        votetime: Date.now(),
        votingperiod: false
    };
    let embed = new discord.RichEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.Attachment("testtemp.png");
        await user1.send("Here is your template:");
        await user1.send(att);
        await user2.send("Here is your template:");
        await user2.send(att);
    }
    matches.push(newmatch);
    return matches;
}
exports.start = start;
async function running(matches, client) {
    for (const match of matches) {
        let channelid = client.channels.get(match.channelid);
        if (match.votingperiod === false) {
            if (Date.now() - match.p1.time === 0 && match.p1.memedone === false) {
                match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${match.p1.userid.id} and ${match.p2.userid.id}`)
                    .setDescription(`<@${match.p2.userid.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
                match.matchdone = true;
            }
            else if (Date.now() - match.p2.time === 0 && match.p2.memedone === false) {
                match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${match.p1.userid.id} and ${match.p2.userid.id}`)
                    .setDescription(`<@${match.p1.userid.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
                match.matchdone = true;
            }
            else if ((match.p2.memedone === true) && (match.p1.memedone === true)) {
                let embed1 = new discord.RichEmbed()
                    .setImage(match.p1.memelink)
                    .setTimestamp();
                let embed2 = new discord.RichEmbed()
                    .setImage(match.p2.memelink)
                    .setTimestamp();
                let embed3 = new discord.RichEmbed()
                    .setTitle("Please vote")
                    .setDescription("Vote for Meme 1 reacting with 1\nMeme 2 by reacting with 2");
                await channelid.send(embed1);
                await channelid.send(embed2);
                await channelid.send(embed3).then(async (msg) => {
                    await msg.react("🅰️");
                    await msg.react("🅱️");
                });
            }
        }
    }
}
exports.running = running;
