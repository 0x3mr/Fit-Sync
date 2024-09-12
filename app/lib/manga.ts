import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);
const dbName = 'fitsync';
// define db once
const db = client.db(dbName);


async function ensureIndex() {
    try {
        // Check if the collection exists
        const collections = await db.listCollections({ name: 'sessions' }).toArray();
        if (collections.length === 0) {
            await db.createCollection('sessions');
        }

        // Ensure the index exists
        const index = await db.collection("sessions").indexes();
        if (!index.some(idx => idx.name === 'date_1')) {
            await db.collection("sessions").createIndex(
                { date: 1 },
                { expireAfterSeconds: 3600 * 24, name: 'date_1' } // 24 hours
            );
        }
    } catch (error) {
        console.error('Error ensuring index:', error);
    }
}
ensureIndex();

export default db;