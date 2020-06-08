import * as discord from "discord.js"
import {getUser} from "../misc/utils"
import {prefix} from "../misc/config.json"

export async function start(message: discord.Message, client: discord.Client){
    //.start @user1 @user2
    
    let users:string[] = []
    var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)
    console.log(args)
    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            users.push(userid)
        }
    }
    let user1 = (await client.fetchUser(users[0]))
    let user2 = (await client.fetchUser(users[1]))

    let embed = new discord.RichEmbed()
    .setTitle(`Match between ${user1.username} and ${user2.username}`)
    .setDescription(`<@${user1.id}> and <@${user2.id}> both have 30 mins to complete your memes.\n Contact admins if you have an issue.`)
    .setTimestamp()
    

    
    message.channel.send({embed})
    
    if (["t", "template"].includes(args[3])){
        let att = new discord.Attachment("testtemp.png")
        return message.channel.send(att)
    }

    return;
}
    
