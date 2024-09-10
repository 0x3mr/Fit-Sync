import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);
const dbName = 'fitsync';
// define db once
const db = client.db(dbName);


async function ensureIndex() {
    const index = await db.collection("sessions").indexes();
    if (!index.some(index => index.name === 'date_1')) {
        db.collection("sessions").createIndex(
            { date: 1 },
            { expireAfterSeconds: 3600 * 24, name: 'date_1' } // 24 hours
        );
    }
}
ensureIndex();

export default db;