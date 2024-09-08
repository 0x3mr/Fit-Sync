import { MongoClient } from 'mongodb';

const URI: string = process.env.MONGO_URI as string;

console.log(URI)

export default URI;

