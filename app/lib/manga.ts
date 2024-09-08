import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI as string; // Ensuring the environment variable is treated as a string
