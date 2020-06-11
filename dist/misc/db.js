"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
const config_json_1 = require("./config.json");
const url = config_json_1.db.mongoQuery;
const dbName = config_json_1.db.name;
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(url, { useNewUrlParser: true });
async function connect() {
    return new Promise(resolve => {
        client.connect(async (err) => {
            if (err)
                throw err;
            client.db(dbName).createCollection("activematches");
            console.log("Successfully connected");
            resolve();
        });
    });
}
exports.connect = connect;
async function addMatch(match) {
    await client.db(dbName).collection("activematches").insertOne({ match });
    await console.log("Successfully added match");
}
exports.addMatch = addMatch;
async function getMatch(channelid) {
    return await client.db(dbName).collection("activematches").findOne({ channelid });
}
exports.getMatch = getMatch;
async function deleteMatch(channelid) {
    let result = await client.db(dbName).collection("activematches").deleteOne({ channelid });
    if (result)
        console.log("Match is done");
}
exports.deleteMatch = deleteMatch;
