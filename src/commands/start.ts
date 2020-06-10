import * as discord from "discord.js"
import {getUser} from "../misc/utils"
import {prefix} from "../misc/config.json"
import {activematch} from "../misc/struct"
import { end } from "./winner"
import { addMatch } from "../misc/db"

export async function start(message: discord.Message, client: discord.Client){
    //.start @user1 @user2

    let users:string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    
    if (args.length < 3) {
        return message.reply("invalid response. Command is `.start @user1 @user2 template link`\n or `.start @user1 @user2 theme description`")
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
        p1:{
            userid: user1,
            memedone: false,
            time: Date.now(),
            memelink: "",
            votes: 0,
        },
        p2:{
            userid: user2,
            memedone: false,
            time: Math.floor(Date.now() / 1000),
            memelink: "",
            votes: 0,
        },
        votetime: Math.floor(Date.now() / 1000),
        votingperiod: false,
        // votemessage: null,
    }

    let embed = new discord.RichEmbed()
    .setTitle(`Match between ${user1.username} and ${user2.username}`)
    .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
    .setTimestamp()
    
    
    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[3])){
        let att = new discord.Attachment(message.attachments.array()[0].url)
        await user1.send("Here is your template:")
        await user1.send(att)
        
        await user2.send("Here is your template:")
        await user2.send(att)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    else if (["th", "theme"].includes(args[3])){
        await user1.send(`Your theme is: ${args[4]}`)       
        await user2.send(`Your theme is: ${args[4]}`)

        // await message.channel.send("Here is your template:")
        // await message.channel.send(att)
    }

    //console.log(newmatch)
    // matches.push(newmatch)

    // return matches;

    await addMatch(newmatch)
}

export async function running(messages: discord.Message, matches: activematch[], client: discord.Client){
    for (const match of matches){
        console.log(Math.floor(Date.now() / 1000) - match.votetime)
        console.log((Math.floor(Date.now() / 1000) - match.votetime) >= 120)
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
            if((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false){
                match.p1.userid.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p2.userid.id}> has won!`)
                .setTimestamp()

                channelid.send(embed)
            }

            if((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false){
                console.log(Date.now() - match.p2.time)
                match.p2.userid.send("You have failed to submit your meme, your opponet is the winner.")

                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p1.userid.username}> has won!`)
                .setTimestamp()

                channelid.send(embed)
            }

            if(((Math.floor(Date.now() / 1000) - match.p2.time > 1800) && match.p2.memedone === false) && ((Math.floor(Date.now() / 1000) - match.p1.time > 1800) && match.p1.memedone === false)){
                match.p1.userid.send("You have failed to submit your meme")
                match.p2.userid.send("You have failed to submit your meme")

                let embed = new discord.RichEmbed()
                .setTitle(`Match between ${match.p1.userid.username} and ${match.p2.userid.username}`)
                .setDescription(`<@${match.p1.userid.id}> & ${match.p2.userid.username}have lost\n for not submitting meme on time`)
                .setTimestamp()

                channelid.send(embed)
            }

            if(((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p2.memedone === true) && ((Math.floor(Date.now() / 1000) - match.p2.time < 1800) && match.p1.memedone === true)){
                let embed1 = new discord.RichEmbed()
                .setImage(match.p1.memelink)
                .setTimestamp()
    
                let embed2 = new discord.RichEmbed()
                .setImage(match.p2.memelink)
                .setTimestamp()
                
                let embed3 = new discord.RichEmbed()
                .setTitle("Please vote")
                .setDescription("Vote for Meme 1 reacting with 🅰️\nMeme 2 by reacting with 🅱️")
    
                await channelid.send(embed1)
                await channelid.send(embed2)
                //await channelid.send(embed3)
    
                await channelid.send(embed3).then(async msg => {
                    await (msg as discord.Message).react("🅰️")
                    await (msg as discord.Message).react("🅱️")
                })

                await channelid.send("@eveyone")
                
                // channelid.fetchMessages({ limit: 1 }).then(messages => {
                //     let lastMessage = messages.first();
                //     match.votemessage = lastMessage
                // })

                //console.log(match.votemessage?.content)

                match.votingperiod = true
                match.votetime = (Math.floor(Date.now() / 1000))
                // let messages: discord.Collection < string, discord.Message > = await channelid.fetchMessage(channelid.id)
    
                // let react = messages.last().id
            }
        }

        if(match.votingperiod === true){
            //7200
            if ((Math.floor(Date.now() / 1000) - match.votetime >= 120)){
                end(messages, matches, client)
            }
        }
    }
}