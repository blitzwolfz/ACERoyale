import * as discord from "discord.js";
import { activematch } from "../misc/struct";
export declare function start(message: discord.Message, client: discord.Client): Promise<discord.Message | discord.Message[] | undefined>;
export declare function running(messages: discord.Message, matches: activematch[], client: discord.Client): Promise<void>;
