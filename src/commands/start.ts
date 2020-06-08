import * as discord from "discord.js"
import {getUser} from "../misc/utils"
import {prefix} from "../misc/config.json"
import {activematch} from "../misc/struct"

export async function start(message: discord.Message, client: discord.Client, matches: activematch[]){
    //.start @user1 @user2

    let users:string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    
    if (args.length < 3) {
        return message.reply("invalid response. Command is `.start @user1 @user2 template`")
    }
    
    //console.log(args)

    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            users.push(userid)
        }
    }
    let user1 = (await client.fetchUser(users[0]))
    let user2 = (await client.fetchUser(users[1]))

    let newmatch:activematch = {
        channelid:message.channel.id,
        matchdone: false,
        p1:{
            userid: user1,
            username: user1.username,
            memedone: false,
            time: Date.now(),
            memelink: "",
        },
        p2:{
            userid: user2,
            username: user2.username,
            memedone: false,
            time: Date.now(),
            memelink: "",
        },
        votetime: Date.now(),
        votingperiod: false
    }

    let embed = new discord.RichEmbed()
    .setTitle(`Match between ${user1.username} and ${user2.username}`)
    .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
    .setTimestamp()
    
    
    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[3])){
        let att = new discord.Attachment("testtemp.png")
        await user1.send("Here is your template:")
        await user1.send(att)
        
        await user2.send("Here is your template:")
        await user2.send(att)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    //console.log(newmatch)
    matches.push(newmatch)

    return matches;
}
    


export async function running(matches: activematch[], client: discord.Client){
    for (const match of matches){
        let channelid = <discord.TextChannel>client.channels.get(match.channelid)

        // if((match.p2.memedone === true) && (match.p1.memedone === true)){
        //     console.log("Hello")
        //     let embed1 = new discord.RichEmbed()
        //     .setImage(match.p1.memelink)
        //     .setTimestamp()

        //     let embed2 = new discord.RichEmbed()
        //     .setImage(match.p1.memelink)
        //     .setTimestamp()

        //     channel.send(embed1)
        //     channel.send(embed2)
        // }

        if(match.votingperiod === false){
            if(Date.now() - match.p1.time === 0 && match.p1.memedone === false){
                match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.id} and ${match.p2.userid.id}`)
                .setDescription(`<@${match.p2.userid.id}> has won!`)
                .setTimestamp()

                channelid.send(embed)
                match.matchdone = true
            }

            else if(Date.now() - match.p2.time === 0 && match.p2.memedone === false){
                match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.id} and ${match.p2.userid.id}`)
                .setDescription(`<@${match.p1.userid.id}> has won!`)
                .setTimestamp()

                channelid.send(embed)
                match.matchdone = true
            }

            else if((match.p2.memedone === true) && (match.p1.memedone === true)){
                let embed1 = new discord.RichEmbed()
                .setImage(match.p1.memelink)
                .setTimestamp()
    
                let embed2 = new discord.RichEmbed()
                .setImage(match.p2.memelink)
                .setTimestamp()
    
                let embed3 = new discord.RichEmbed()
                .setTitle("Please vote")
                .setDescription("Vote for Meme 1 reacting with 1\nMeme 2 by reacting with 2")
    
                await channelid.send(embed1)
                await channelid.send(embed2)
                //await channelid.send(embed3)
    
                await channelid.send(embed3).then(async msg => {
                    await (msg as discord.Message).react("🅰️")
                    await (msg as discord.Message).react("🅱️")
                })
                // let messages: discord.Collection < string, discord.Message > = await channelid.fetchMessage(channelid.id)
    
                // let react = messages.last().id
            }
            


        }




    }
}