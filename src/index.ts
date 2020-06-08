import * as Discord from "discord.js";
import * as config from "./misc/config.json";

console.log("Hello World, bot has begun life");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

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
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  else if(command === "submit"){

    if (message.attachments.size > 1){
      return message.reply("You can't submit more than one image")
    }

    else if(message.attachments.size <= 0){
      return message.reply("You haven't even submitted an image")
    }

    else{
      let attach = message.attachments
      await message.reply(" Thank you for submitting an image")
      let channel = await <Discord.TextChannel>client.channels.get("716446874424573963");
      //await channel.send(`New image by ${message.author.tag}`)
      
      let embed = new Discord.RichEmbed()
      .setTitle(`Image submitted by ${message.author.tag}`)
      .setImage(attach.array()[0].url)
      .setFooter(new Date())
      
      return await channel.send({embed})
      //return await channel.send(attach.array()[0].url)
    }

  }

});

client.login(config.token);

