
export interface activematch{
    channelid:string;
    p1:{
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    },
    p2:{
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    },
    votetime: number;
    votingperiod: boolean;
    // votemessage: null,
}