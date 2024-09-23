import { ObjectId } from "mongodb";
import db from "../lib/manga";
import cookie from "cookie";
import { NextApiRequest } from "next";
import { start } from "repl";
import { formatDate } from "../lib/utils";
import { ShipOptions } from '../../constants/gymPlans';

const memberships = db.collection("memberships");
const sessions = db.collection("sessions");

export interface Ship {
  email: string;
  start: Date;
  end: Date;
  status: "ongoing" | "ended" | "paused";
  pause_limit: number;
  type: number;
  days_left?: number;
}

type Updates = {
  type?: number;
  start?: Date;
  end?: Date;
  status?: "ongoing" | "ended" | "paused";
  pause_limit?: number;
};

export function hasAccess(type: Number) {
  return ShipOptions[Number(type)];
}

export async function getAllShips() {
  return await memberships.find({}).toArray();
}

export async function getShipByEmail(email: string) {
  return await memberships.findOne({ email: email });
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
  const left = Math.ceil(Math.abs(ship.end - ship.start) / (1000 * 60 * 60 * 24));
  return { ship: { ...ship, _id: ship._id.toString(), start: formatDate(ship.start), end: formatDate(ship.end), type: ship.type, days_left: left } };
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
  if (ship.type < 0) ship.type = 5; //default to 5 days

  ship.start = new Date();
  ship.end = new Date(ship.start);
  ship.end.setDate(ship.end.getDate() + Number(ship.type));

  ship.pause_limit = 3;
  ship.status = "ongoing";
  await memberships.insertOne(ship);
  return { ship: ship.email };
}

export async function updateShipPlan(email: string, updateData: Updates) {
  if (!updateData.type) {
    return { err: "Parameter missing." };
  }
  if (updateData.type < 0) updateData.type = 5; //default to 5 days

  updateData.start = new Date();
  updateData.end = new Date(updateData.start);
  updateData.end.setDate(updateData.end.getDate() + Number(updateData.type));

  updateData.pause_limit = 3;
  updateData.status = "ongoing";

  const ship = await memberships.updateOne({ email: email }, { $set: updateData });
  if (!ship) {
    return { err: "Membership not found." };
  }
  return { ship };
}

export async function updateShipStatus(email: string, updateData: Updates) {
  if (!updateData.status) {
    return { err: "Parameter missing." };
  }

  const exist = await memberships.findOne({ email: email });
  if (!exist) {
    return { err: "Membership not found." };
  }

  if (Number(exist.pause_limit) < 0){
    return { err: "Maxmuim pauses reached." };
  }
  updateData.pause_limit = Number(exist.pause_limit) - 1;
  
  if (exist.status == "ongoing") {
    updateData.status = "paused";
  }
  else{
    updateData.status = "ongoing";
  }
  console.log(updateData, exist)

  const ship = await memberships.updateOne({ email: email }, { $set: updateData });
  if (!ship) {
    return { err: "Membership not found." };
  }
  return { ship };
}

export async function deleteShip(email: string) {
  const exist = await memberships.findOne({ email: email });
  if (!exist) {
    return { err: "Membership not found." };
  }
  const del = await memberships.deleteOne({ email: email });
  if (!del) {
    return { err: "Something went wrong." };
  }
  return {del}
}
