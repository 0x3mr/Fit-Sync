import { ObjectId } from "mongodb";
import db from "../lib/manga";
import { v4 as uuidv4 } from "uuid";
import cookie from "cookie";
import { NextApiRequest } from "next";

const users = db.collection("users");
const sessions = db.collection("sessions");

interface User {
  _id?: ObjectId; // Optional for new users
  F_name: string;
  L_name: string;
  email: string;
  password: string;
  age: number;
  height: number;
  weight: number;
  role: "user" | "admin" | "coach";
}

interface Login_User {
  email: string;
  password: string;
}

export async function getAllUsers() {
  return await users.find({}).toArray();
}

export async function getUserById(id: string) {
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function getUserBySessionId(sessionID: string) {
  const session = await sessions.findOne({ sessionID });
  if (!session) {
    return { err: "Session not found or expired." };
  }
  const user = await users.findOne({ email: session.email });
  if (!user) {
    return { err: "User not found." };
  }
  return { user };
}

export async function getUserByReq(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  const { user, err } = await getUserBySessionId(sessionID);
  if (err) {
    return { err };
  }
  if (!user) {
    return { err: "User not found." };
  }
  return { user };
}

export async function createUser(userData: User) {
  const exist = await users.findOne({ email: userData.email });
  if (exist) {
    return { err: "Email Already Registered, Please login." };
  }
  userData.role = "user";
  await users.insertOne(userData);
  return { user: userData.email };
}

export async function loginUser(userData: Login_User) {
  const exist = await users.findOne({ email: userData.email });
  if (!exist) {
    return { err: "Email not found, Please Register." };
  }
  const id = uuidv4();
  await sessions.insertOne({
    sessionID: id,
    email: userData.email,
    role: exist.role,
    date: new Date(),
  });
  return { sessionID: id };
}

export async function logoutUser(userData: string) {
  const exist = await sessions.findOne({ sessionID: userData });
  if (!exist) {
    return { err: "not authorized." };
  }
  await sessions.deleteOne({ sessionID: userData });
  return { state: "ok" };
}

export async function isAdmin(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  const exist = await sessions.findOne({ sessionID: sessionID });
  if (!exist) {
    return { err: "not authorized." };
  }
  return { state: exist.role === "admin" };
}

export async function promoteUser(req: NextApiRequest, userId: string) {
  const adminCheck = await isAdmin(req);
  if (adminCheck.err) {
    return { err: adminCheck.err };
  }
  if (!adminCheck.state) {
    return {
      err: "You are not authorized to promote users. Admin access required.",
    };
  }
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return { err: "User not found." };
  }
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: "admin" } }
  );

  // Return success or error based on the result of the update
  if (result.modifiedCount === 1) {
    return { success: "User successfully promoted to admin." };
  } else {
    return { err: "Failed to promote user. Please try again." };
  }
}

export async function isValidSession(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  if (!sessionID) {
    return 1;
  }
  const exist = await sessions.findOne({ sessionID: sessionID });
  if (!exist) {
    return 2;
  }
  return 0;
}

export async function updateUser(id: string, updateData: User) {
  return await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function deleteUser(id: string) {
  return await users.deleteOne({ _id: new ObjectId(id) });
}
