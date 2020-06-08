import * as Discord from "discord.js";
import * as ConfigFile from "./misc/config.json";
import { CommandStruct } from "./misc/commandinterface";
const client = new Discord.Client();
const prefix = ConfigFile.prefix;
const token = ConfigFile.token;

//my naming variable skills is ass
let commands: CommandStruct[] = [];

//dirname in this case is set to ..\src\
//dirname tells you the directory of the commands
loadCommands(`${__dirname}/commands`);

//If everything procceds as normal, this message should appear
client.once("ready", () => {
  console.log("Bot is ready and has logged in");
  console.log("User prefix is ", `${[prefix]}`);
});

//holds the bulk of of our commands
client.on("message", async (message: Discord.Message) => {
  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith(prefix)) {
    return;
  }

  if (message.content == (`${prefix}ping`)) {
        message.channel.send("🚀 pong");
        console.log(message.content);
        // message.reply('pong!');
  }
  
  await handleCommands(message);
  
});

//might change the argument to a args para.. but for now it stays as is
async function handleCommands(message: Discord.Message) {
  //removes prefix as we don't need that
  let commandNameInput = message.content.toLowerCase().split(" ")[0].replace(prefix, "");
  console.log(commandNameInput)

  //removes command name, as we will use args to run our commands
  let args = message.content.toLowerCase().split(" ").splice(1);
  console.log(args)
  for (const commandsClass of commands) {
    //don't want the bot to crash on the users lmao
    try {
          
      //checking to see if this is the correct command
      if (!commandsClass.theCommand(commandNameInput)) {
        //continue the loop until correct command is found
        console.log("1");
        //continue;
      }
      else{
        if(commandsClass.theCommand(commandNameInput) && args[0] === "help" && args.length > 0){
          console.log("2")
          await message.reply(commandsClass.help())
        }
        
        else {
            await commandsClass.runCommand(args, message, client);
            console.log("4");
        }
      }

    } catch (error) {
      console.log(`${error} caused the error`);
    }
  }
}

function loadCommands(commandsPath: string) {
  //commandName takes the name of commands found in config.ts
  //commandsClass takes the directory of the commandName
  //command is the command itself
  //commands is a list that holds all the commands
  console.log("ok")
  //If there are no commands in the config file then exit
  if (!ConfigFile || (ConfigFile.commands as string[]).length === 0) {
    return;
  }

  //loop through config to find all the commands
  for (const commandName of ConfigFile.commands as string[]) {
    const commandsClass = require(`${commandsPath}/${commandName}`).default;

    const command = new commandsClass() as CommandStruct;

    commands.push(command);
  }

  //console.log(commands)
}

client.login(token);