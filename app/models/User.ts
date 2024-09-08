// app/models/User.ts
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri);
const dbName = 'your-db-name';
const collectionName = 'users';

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
  const db = client.db(dbName);
  const users = db.collection(collectionName);
  return await users.find({}).toArray();
}

export async function getUserById(id: string) {
  const db = client.db(dbName);
  const users = db.collection(collectionName);
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function createUser(userData: User) {
  const db = client.db(dbName);
  const users = db.collection(collectionName);
  return await users.insertOne(userData);
}

export async function updateUser(id: string, updateData: User) {
  const db = client.db(dbName);
  const users = db.collection(collectionName);
  return await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function deleteUser(id: string) {
  const db = client.db(dbName);
  const users = db.collection(collectionName);
  return await users.deleteOne({ _id: new ObjectId(id) });
}
