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
const winner_1 = require("./winner");
const card_1 = require("./card");
async function start(message, client, matches) {
    let users = [];
    var args = message.content.slice(config_json_1.prefix.length).trim().split(/ +/g);
    if (args.length < 3) {
        return message.reply("invalid response. Command is `.start @user1 @user2 template link`\n or `.start @user1 @user2 theme description`");
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
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        p2: {
            userid: user2.id,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
            voters: [],
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
    };
    await card_1.vs(message, client, users);
    let embed = new discord.RichEmbed()
        .setTitle(`Match between ${user1.username} and ${user2.username}`)
        .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
        .setTimestamp();
    message.channel.send({ embed });
    if (["t", "template"].includes(args[3])) {
        let att = new discord.Attachment(message.attachments.array()[0].url);
        await user1.send("Here is your template:");
        await user1.send(att);
        await user2.send("Here is your template:");
        await user2.send(att);
    }
    else if (["th", "theme"].includes(args[3])) {
        await user1.send(`Your theme is: ${args[4]}`);
        await user2.send(`Your theme is: ${args[4]}`);
    }
    matches.push(newmatch);
    return matches;
}
exports.start = start;
async function running(matches, client) {
    for (const match of matches) {
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 1800);
        let channelid = client.channels.get(match.channelid);
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        if (match.votingperiod === false) {
            if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
                user1.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
                console.log(Date.now() - match.p2.time);
                user2.send("You have failed to submit your meme, your opponet is the winner.");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.username}> has won!`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
                user1.send("You have failed to submit your meme");
                user2.send("You have failed to submit your meme");
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p2.memedone === true) && ((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p1.memedone === true)) {
                let embed1 = new discord.RichEmbed()
                    .setImage(match.p1.memelink)
                    .setTimestamp();
                let embed2 = new discord.RichEmbed()
                    .setImage(match.p2.memelink)
                    .setTimestamp();
                let embed3 = new discord.RichEmbed()
                    .setTitle("Please vote")
                    .setDescription("Vote for Meme 1 reacting with 🅰️\nMeme 2 by reacting with 🅱️");
                await channelid.send(embed1);
                await channelid.send(embed2);
                await channelid.send(embed3).then(async (msg) => {
                    await msg.react("🅰️");
                    await msg.react("🅱️");
                });
                match.votingperiod = true;
                match.votetime = (Math.floor(Date.now() / 1000));
            }
        }
        if (match.votingperiod === true) {
            if ((Math.floor(Date.now() / 1000) - match.votetime >= 3600)) {
                await winner_1.end(matches, client);
            }
        }
    }
}
exports.running = running;
