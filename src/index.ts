import * as Discord from "discord.js";
import * as config from "./misc/config.json";
import {activematch} from "./misc/struct"
import {submit} from "./commands/submit"
import { start, running } from "./commands/start";
import { endmatch } from "./commands/winner";
import { vs } from "./commands/card";
import { getUser } from "./misc/utils";
//import data from "../match.json"
const fs = require('fs');

console.log("Hello World, bot has begun life");

let data = fs.readFileSync('./match.json');
let matchdata = JSON.parse(data);

let matches:activematch[] = matchdata

const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http');
//@ts-ignore
var _server = http.createServer(app);
const client = new Discord.Client();

app.get('/', (_request: any, response: any) => {
    response.sendFile(__dirname + "/index.html");
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    console.log("OK")
    // for(let i = 0; i < 2; i++) console.log(i)
    await running(matches, client)
    let data = JSON.stringify(matches, null, 2);
    if (!matches){
      await fs.writeFile('./match.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    }

});



client.on("messageReactionAdd", async function(messageReaction, user){
  console.log(`a reaction is added to a message`);
  //console.log(messageReaction, user)
  if(user.bot) return;

  if(matches){
    for (const match of matches){
      console.log(match.p1.voters)
      console.log(match.p2.voters)
      if(user.id === match.p1.userid || user.id === match.p2.userid){
        await messageReaction.remove(user.id)
        return await user.send("Can't vote on your own meme")
      }
      
      let id = client.channels.get(messageReaction.message.channel.id)?.id

      if(match.channelid === id){
        
        if(!match.p1.voters.includes(user.id) && !match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
  
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
        }

        else if(match.p1.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            match.p2.votes += 1
            match.p2.voters.push(user.id)
            
            match.p1.votes -= 1
            match.p1.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")
          }
        }

        else if(match.p2.voters.includes(user.id)){
          if (messageReaction.emoji.name === "🅱️"){
            await user.send("You can't vote on the same meme twice") 
            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅱️")

          }
  
          else if (messageReaction.emoji.name === "🅰️"){
            match.p1.votes += 1
            match.p1.voters.push(user.id)
            
            match.p2.votes -= 1
            match.p2.voters.splice(match.p1.voters.indexOf(user.id), 1)

            await messageReaction.remove(user.id)
            await messageReaction.message.react("🅰️")
          }
        }
        console.log(match.p1.voters)
        console.log(match.p2.voters)
      }
      
    }
    let data = JSON.stringify(matches, null, 2);

    await fs.writeFile('./match.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
  }

});


client.on("message", async message => {
  //const gamemaster = message.guild.roles.get("719936221572235295");

  if (message.author.bot){
    return;
  }

  const prefix = config.prefix;
  console.log(matches)
  
  

  if (message.content.indexOf(prefix) !== 0 || message.author.bot){
    return;
  }

  
  await running(matches, client)
  var args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g);
  
  if (!args || args.length === 0) {
    return
  };
  
  const command: string | undefined = args?.shift()?.toLowerCase();
  
  if (!command){
    return
  };
  
  console.log(matches)

  if (command === "ping") {
    const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
    m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  else if(command === "submit"){
    await submit(message, matches)
    if(!matches) await running(matches, client)
  }

  else if(command === "start"){
    await start(message, client, matches)
  }

  else if(command === "end"){
    if (message.author.id !== "239516219445608449"){
      return
    }
    await endmatch(message, matches, client)
  }

  else if(command === "vs"){
    let users: Array<string> = []
    
    for (let i = 0; i < args.length; i++){
        let userid = await getUser(args[i])
        if (userid){
            users.push(userid)
        }
    }
    await vs(message, client, users)
  }

  let data = JSON.stringify(matches, null, 2);

  await fs.writeFile('./match.json', data, (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });
  
});

client.login(config.token);

