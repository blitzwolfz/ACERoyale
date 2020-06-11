export interface activematch {
    channelid: string;
    p1: {
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
    };
    p2: {
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
    };
    votetime: number;
    votingperiod: boolean;
}
