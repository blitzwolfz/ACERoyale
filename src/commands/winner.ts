import * as discord from "discord.js"
// import {getUser} from "../misc/utils"
// import {prefix} from "../misc/config.json"
import {activematch} from "../misc/struct"

export async function endmatch(message: discord.Message, matches: activematch[], client: discord.Client){
    
    for (const match of matches){
        let channelid = <discord.TextChannel>client.channels.get(match.channelid)

        if (message.channel.id === channelid.id){
            if(match.p1.votes > match.p2.votes){
                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p1.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                .setTimestamp()
    
                channelid.send(embed)
    
            }
    
            else if(match.p1.votes < match.p2.votes){
                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p2.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
                .setTimestamp()
                
                channelid.send(embed)
            }

            else if(match.p1.votes === match.p2.votes){
                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
                .setTimestamp()
                
                channelid.send(embed)
            }

            matches.splice(matches.indexOf(match), 1)
            break;
        }

    }
}


export async function end(matches: activematch[], client: discord.Client){
    for (const match of matches){
        let channelid = <discord.TextChannel>client.channels.get(match.channelid)
        console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 35)
        if((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false){
            match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.")

            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`<@${match.p2.userid.id}> has won!`)
            .setTimestamp()

            channelid.send(embed)
        }

        else if((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false){
            console.log(Date.now() - match.p2.time)
            match.p2.userid.send("You have failed to submit your meme, your opponet is the winner.")

            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`<@${match.p1.userid.username}> has won!`)
            .setTimestamp()

            channelid.send(embed)
        }

        else if(((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)){
            match.p1.userid.send("You have failed to submit your meme")
            match.p2.userid.send("You have failed to submit your meme")

            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`<@${match.p1.userid.id}> & ${match.p2.userid.username}have lost\n for not submitting meme on time`)
            .setTimestamp()

            channelid.send(embed)
        }

        else if(match.p1.votes > match.p2.votes){
            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`<@${match.p1.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setTimestamp()

            channelid.send(embed)

        }

        else if(match.p1.votes < match.p2.votes){
            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`<@${match.p2.userid.id}> has won!\n The final votes where ${match.p1.votes} to ${match.p2.votes}`)
            .setTimestamp()
            
            channelid.send(embed)
        }

        else if(match.p1.votes === match.p2.votes){
            let embed = new discord.RichEmbed()
            .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
            .setDescription(`Both users have come to a draw.\nPlease find a new time for your rematch.`)
            .setTimestamp()
            
            channelid.send(embed)
        }

        matches.splice(matches.indexOf(match), 1)

    }
}


