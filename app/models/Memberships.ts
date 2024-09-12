import { ObjectId } from "mongodb";
import db from "../lib/manga";
import cookie from "cookie";
import { NextApiRequest } from "next";

const memberships = db.collection("memberships");
const sessions = db.collection("sessions");

interface Ship {
  email: string;
  start: Date; 
  end: Date;
  status: "ongoing" | "ended" | "paused";
  pause_limit: number;
  type: number;
}

export async function getAllShips() {
  return await memberships.find({}).toArray();
}

export async function getShipByEmail(email: string) {
  return await memberships.findOne({ email: new ObjectId(email) });
}

export async function getShipBySessionId(sessionID: string) {
  const session = await sessions.findOne({ sessionID });
  if (!session) {
    return { err: "Session not found or expired." };
  }
  const ship = await memberships.findOne({ email: session.email });
  if (!ship) {
    return { err: "Memebership not found." };
  }
  return { ship };
}

export async function getShipByReq(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  const { ship, err } = await getShipBySessionId(sessionID);
  if (err) {
    return { err };
  }
  if (!ship) {
    return { err: "Membership not found." };
  }
  return { ship };
}

export async function createShip(ship: Ship) {
  const exist = await memberships.findOne({ email: ship.email });
  if (exist) {
    return { err: "Membership Already Registered....." };
  }
  if (ship.type < 0) ship.type = 3;
  ship.start = new Date();
  ship.end = new Date();
  ship.end.setMonth(ship.start.getMonth() + ship.type);
  ship.pause_limit = 3;
  ship.status = "ongoing";
  await memberships.insertOne(ship);
  return { ship: ship.email };
}

export async function updateShip(email: string, updateData: Ship) {
    return await memberships.updateOne({ email: email }, { $set: updateData });
}

export async function deleteShip(email: string) {
    const exist = await memberships.findOne({ email: email});
    if (!exist) {
      return { err: "Membership not found." };
    }
    return await memberships.deleteOne({ email: email });
}
