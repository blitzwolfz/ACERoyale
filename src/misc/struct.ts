export interface activematch{
    channelid: string;
    p1: {
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        votelist : Array<number>;
    };
    p2: {
        userid: string;
        memedone: boolean;
        time: number;
        memelink:string;
        votes: number;
        votelist : Array<number>;
    }
    votetime:number;
    votingperiod: boolean;
    // votemessage: (discord.Message | null);
}