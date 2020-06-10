import * as discord from "discord.js";
export interface activematch {
    channelid: string;
    p1: {
        userid: discord.User;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
    };
    p2: {
        userid: discord.User;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
    };
    votetime: number;
    votingperiod: boolean;
}
