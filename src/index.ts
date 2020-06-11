import * as Discord from "discord.js";
import * as config from "./misc/config.json";
import {activematch} from "./misc/struct"
import {submit} from "./commands/submit"
import { start, running } from "./commands/start";
import { endmatch } from "./commands/winner";
import { connect, getallMatch, getMatch } from "./misc/db";

console.log("Hello World, bot has begun life");

const client = new Discord.Client();
let matches:activematch[]


client.on('ready', async () => {
    await connect()
    console.log(`Logged in as ${client.user?.tag}\n`);
    matches = await getallMatch()
});



client.on("messageReactionAdd", async function(messageReaction, user){
  console.log(`a reaction is added to a message`);
  //console.log(messageReaction, user)
  if(user.bot) return;

  if(matches){
    for (const match of matches){
      let id = client.channels.get(messageReaction.message.channel.id)?.id

      if(match.channelid === id){
        if (messageReaction.emoji.name === "🅱️"){
          match.p2.votes += 1
          await messageReaction.remove(user.id)
          await messageReaction.message.react("🅱️")
        }

        else if (messageReaction.emoji.name === "🅰️"){
          match.p1.votes += 1
          await messageReaction.remove(user.id)
          await messageReaction.message.react("🅰️")
        }
      }
    }
    
  }

});


client.on("message", async message => {
  //const gamemaster = message.guild.roles.get("719936221572235295");

  if (message.author.bot){
    return;
  }

  const prefix = config.prefix;
  console.log(matches)
  //matches = await getallMatch()
  
  matches = await getallMatch()
  //running(message, matches, client)

  if (message.content.indexOf(prefix) !== 0 || message.author.bot){
    return;
  }


  var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g);
  
  if (!args || args.length === 0) {
    return
  };
  
  const command: string | undefined = args?.shift()?.toLowerCase();
  
  if (!command){
    return
  };
  
  //console.log(matches)

  if (command === "ping") {
    const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
    m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  else if(command === "submit"){
    submit(message, matches, client)
  }

  else if(command === "start"){
    start(message, client)
  }

  else if(command === "end"){
    endmatch(message, matches, client)
  }

  else if(command === "testget"){
    let g = await getMatch(message.channel.id)
    console.log(g)
  }

  
});

client.login(config.token);

