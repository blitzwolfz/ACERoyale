import * as discord from "discord.js";
import { activematch } from "../misc/struct";
export declare function start(message: discord.Message, client: discord.Client, matches: activematch[]): Promise<discord.Message | discord.Message[] | activematch[]>;
export declare function running(messages: discord.Message, matches: activematch[], client: discord.Client): Promise<void>;
