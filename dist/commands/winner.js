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
        if (message.channel.id === channelid.id) {
            if (match.p1.votes > match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                    .setDescription(`<@${match.p1.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (match.p1.votes < match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                    .setDescription(`<@${match.p2.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                    .setTimestamp();
                channelid.send(embed);
            }
            else if (match.p1.votes === match.p2.votes) {
                let embed = new discord.RichEmbed()
                    .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
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
        if (match.p1.votes > match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p1.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                .setTimestamp();
            channelid.send(embed);
        }
        else if (match.p1.votes < match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p2.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                .setTimestamp();
            channelid.send(embed);
        }
        else if (match.p1.votes === match.p2.votes) {
            let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                .setTimestamp();
            channelid.send(embed);
        }
        matches.splice(matches.indexOf(match), 1);
        break;
    }
}
exports.end = end;
