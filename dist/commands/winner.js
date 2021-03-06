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
async function endmatch(message, matches, client) {
    for (const match of matches) {
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        let channelid = client.channels.get(match.channelid);
        if (message.channel.id === channelid.id) {
            if (match.p1.votes > match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user1.username} won with image A`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (match.p1.votes < match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user2.username} won with image B`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (match.p1.votes === match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                    .setTimestamp();
                channelid.send(embed);
            }
            matches.splice(matches.indexOf(match), 1);
            break;
        }
    }
}
exports.endmatch = endmatch;
async function end(matches, client) {
    for (const match of matches) {
        let channelid = client.channels.get(match.channelid);
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35);
        if ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false) {
            user1.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if ((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) {
            console.log(Date.now() - match.p2.time);
            user2.send("You have failed to submit your meme, your opponet is the winner.");
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)) {
            user1.send("You have failed to submit your meme");
            user2.send("You have failed to submit your meme");
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> & ${user2.id}have lost\n for not submitting meme on time`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes > match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user1.username} won with image A`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes < match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}\n${user2.username} won with image B`)
                .setTimestamp();
            await channelid.send(embed);
        }
        else if (match.p1.votes === match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                .setTimestamp();
            await channelid.send(embed);
        }
        matches.splice(matches.indexOf(match), 1);
    }
}
exports.end = end;
