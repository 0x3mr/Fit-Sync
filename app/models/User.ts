// app/models/User.ts
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI as string;
const client = new MongoClient(uri);
const dbName = 'fitsync';
const collectionName = 'users';
// define db once
const db = client.db(dbName);
const users = db.collection(collectionName);

interface User {
    _id?: ObjectId; // Optional for new users
    F_name: string;
    L_name: string;
    Email: string;
    Password: string;
    Age: number;
    Height: number;
    Weight: number;
    Role: string;
}


export async function getAllUsers() {
  return await users.find({}).toArray();
}

export async function getUserById(id: string) {
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function createUser(userData: User) {
  return await users.insertOne(userData);
}

export async function updateUser(id: string, updateData: User) {
  return await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function deleteUser(id: string) {
  return await users.deleteOne({ _id: new ObjectId(id) });
}
