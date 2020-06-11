import * as Discord from "discord.js";
import { activematch } from "../misc/struct";
import { updateMemeLink } from "../misc/db";

export async function submit(message: Discord.Message, matches: activematch[], client: Discord.Client) {
    if (message.attachments.size > 1){
        return message.reply("You can't submit more than one image")
    }
    
    else if(message.attachments.size <= 0){
        return message.reply("Your image was not submitted properly. Contact a mode")
    }

    else if(message.channel.type !== "dm"){
        return message.reply("You didn't not submit this in the DM with the bot.\nPlease delete and try again.")
    }

    else{
        for (const match of matches){
            console.log(match)
            let user1 = (await client.fetchUser(match.p1.userid))
            let user2 = (await client.fetchUser(match.p2.userid))
            if(user1.id === message.author.id && !match.p1.memedone){
                // match.p1.memedone = true
                // match.p1.memelink = message.attachments.array()[0].url
                console.log(await updateMemeLink(match.channelid,  `p1.memelink: ${message.attachments.array()[0].url}`, true))
            }

            if(user2.id === message.author.id && !match.p2.memedone){
                // match.p2.memedone = true
                // `match.p2.memelink: ${message.attachments.array()[0].url}`
                console.log(await updateMemeLink(match.channelid,  `p2.memelink: ${message.attachments.array()[0].url}`, true))
                
            }

            
            return message.reply("Your meme has been attached!")
        }
        
    }
    
}
