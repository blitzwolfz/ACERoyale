"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function submit(message, matches) {
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
            if (match.p1.userid === message.author.id && !match.p1.memedone) {
                match.p1.memedone = true;
                match.p1.memelink = message.attachments.array()[0].url;
                return message.reply("Your meme has been attached!");
            }
            if (match.p2.userid === message.author.id && !match.p2.memedone) {
                match.p2.memedone = true;
                match.p2.memelink = message.attachments.array()[0].url;
                return message.reply("Your meme has been attached!");
            }
        }
    }
}
exports.submit = submit;
