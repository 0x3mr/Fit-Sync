import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);
const dbName = 'fitsync';
// define db once
const db = client.db(dbName);

export default db;