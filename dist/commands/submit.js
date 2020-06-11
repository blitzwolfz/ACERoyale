"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../misc/db");
async function submit(message, matches, client) {
    if (message.attachments.size > 1) {
        return message.reply("You can't submit more than one image");
    }
    else if (message.attachments.size <= 0) {
        return message.reply("Your image was not submitted properly. Contact a mode");
    }
    else if (message.channel.type !== "dm") {
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.");
    }
    else {
        for (const match of matches) {
            console.log(match);
            let user1 = (await client.fetchUser(match.p1.userid));
            let user2 = (await client.fetchUser(match.p2.userid));
            if (user1.id === message.author.id && !match.p1.memedone) {
                console.log(await db_1.updateMemeLink(match.channelid, `p1.memelink: ${message.attachments.array()[0].url}`, true));
            }
            if (user2.id === message.author.id && !match.p2.memedone) {
                console.log(await db_1.updateMemeLink(match.channelid, `p2.memelink: ${message.attachments.array()[0].url}`, true));
            }
            return message.reply("Your meme has been attached!");
        }
    }
}
exports.submit = submit;
