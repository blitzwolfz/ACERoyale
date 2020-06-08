import * as Discord from "discord.js";
import * as config from "./misc/config.json";
//import {activematch} from "./misc/struct"
import {submit} from "./commands/submit"
import { start } from "./commands/start";

console.log("Hello World, bot has begun life");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

//let matches:activematch[] = []

client.on("message", async message => {
  const prefix = config.prefix;

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

  if (command === "ping") {
    const m: Discord.Message = await message.channel.send("Ping?") as Discord.Message;
    m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  else if(command === "submit"){
    submit(message)
  }

  else if(command === "start"){
    start(message, client)
  }

});

client.login(config.token);

