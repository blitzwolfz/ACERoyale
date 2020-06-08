import * as Discord from "discord.js";
import { activematch } from "../misc/struct";
export declare function submit(message: Discord.Message, matches: activematch[]): Promise<Discord.Message | Discord.Message[] | undefined>;
