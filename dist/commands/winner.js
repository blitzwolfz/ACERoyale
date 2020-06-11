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
        let channelid = client.channels.get(match.channelid);
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        if (message.channel.id === channelid.id) {
            if (match.p1.votes > match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (match.p1.votes < match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${user1.username} and ${user2.username}`)
                    .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
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
async function end(message, matches, client) {
    for (const match of matches) {
        let channelid = client.channels.get(match.channelid);
        console.log(Math.floor(Date.now() / 1000) - match.votetime);
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35);
        let user1 = (await client.fetchUser(match.p1.userid));
        let user2 = (await client.fetchUser(match.p2.userid));
        if (match.p1.votes > match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user1.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                .setTimestamp();
            channelid.send(embed);
        }
        else if (match.p1.votes < match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${user1.username} and ${user2.username}`)
                .setDescription(`<@${user2.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
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
exports.end = end;
