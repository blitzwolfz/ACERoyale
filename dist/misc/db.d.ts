import { activematch } from "./struct";
export declare function connect(): Promise<void>;
export declare function addMatch(match: activematch): Promise<void>;
export declare function getMatch(channelid: string): Promise<activematch>;
export declare function getallMatch(): Promise<activematch[]>;
export declare function deleteMatch(channelid: string): Promise<void>;
export declare function updateMemeLink(channelid: string, links: string, memedone: boolean): Promise<void>;