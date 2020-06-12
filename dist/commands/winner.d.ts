import * as discord from "discord.js";
import { activematch } from "../misc/struct";
export declare function endmatch(message: discord.Message, matches: activematch[], client: discord.Client): Promise<void>;
export declare function end(matches: activematch[], client: discord.Client): Promise<void>;
