import * as mongodb from "mongodb";
import { db } from "./config.json";
import { activematch } from "./struct";


const url: string = db.mongoQuery;
//const client = new mongodb.MongoClient(url);
//const client = new mongodb.MongoClient(url);
const dbName = db.name;

const MongoClient = mongodb.MongoClient;

const client = new MongoClient(url, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

export async function connect(): Promise<void>{
    return new Promise(resolve => {
        client.connect(async err => {
            if (err) throw err;
            
            client.db(dbName).createCollection("activematches");
            console.log("Successfully connected");
            resolve();
        });
    });
}

export async function addMatch(match: activematch){
    await client.db(dbName).collection("activematches").insertOne({_id:match.channelid, match})
    await console.log("Successfully added match");
}

export async function getMatch(channelid: string): Promise<activematch> {
    //return 
    let mat = await client.db(dbName).collection("activematches").findOne({ _id: channelid })!;
    return await mat.match
}

export async function getallMatch(): Promise<activematch[]> {
    return await client.db(dbName).collection("activematches").find({}, {projection:{ _id: 0 }}).toArray();
}

// export async function updateMatch(channelid: string): Promise<void> {
//     await client.db(dbName).collection("activematches").updateOne({ _id: channelid }, { $set: { ["info.totaltime"]: value } })!;
// }

export async function deleteMatch(channelid: string): Promise<void>{
    let result = await client.db(dbName).collection("activematches").deleteOne({ channelid});
    if (result) console.log("Match is done")
}

export async function updateMemeLink(channelid: string, links: string, memedone: boolean) {
    await client.db(dbName).collection("contracts").replaceOne({_id: channelid}, {$set: {memedone, links}})!;
}
