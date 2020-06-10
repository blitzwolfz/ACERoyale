import * as mongodb from "mongodb";
import { db } from "./config.json";
import { activematch } from "./struct";


const url: string = db.mongoQuery;
const client = new mongodb.MongoClient(url, { useNewUrlParser: true })
//const client = new mongodb.MongoClient(url);
const dbName = db.name;

export async function addMatch(match: activematch): Promise<void> {
    let result = await client.db(dbName).collection("activematches").insertOne(match)
    if (result) console.log("Successfully added match");
}

export async function getMatch(channelid: string): Promise<activematch> {
    return await client.db(dbName).collection("activematches").findOne({ channelid })!;
}

export async function deleteMatch(channelid: string): Promise<void>{
    let result = await client.db(dbName).collection("activematches").deleteOne({ channelid});
    if (result) console.log("Match is done")
}

export async function connectToDB(): Promise<void> {
    return new Promise(resolve => {
        client.connect(async (e: any) => {
            if (e) throw e;
            console.log("Successfully connected to database");
            client.db(dbName).createCollection("activematches");
            resolve();
        });
    });
}