import { ObjectId } from "mongodb";
import db from "../lib/manga";
import { v4 as uuidv4 } from "uuid";
import cookie from "cookie";
import { NextApiRequest } from "next";
import { addDays, getDay, eachDayOfInterval, startOfWeek } from 'date-fns';
import { getShipByEmail } from "./Memberships";
import bcrypt from 'bcrypt';
import threeDPlan from '../../constants/3dPlan.json'
import fourDPlan from '../../constants/4dPlan.json'
import fiveDPlan from '../../constants/5dPlan.json'


const users = db.collection("users");
const sessions = db.collection("sessions");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface User {
  _id?: ObjectId;
  F_name: string;
  L_name: string;
  email: string;
  password: string;
  age: number;
  height: number;
  weight: number;
  role: "user" | "admin" | "coach";
  gender?: "male" | "female";
  training_days?: number[];
  created_at: Date;
  start?: Date;
  end?: Date;
}

interface Login_User {
  email: string;
  password: string;
}


export type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
};

type PlanDetails = {
  id: string;
  name: string;
};

export type TrainingPlanType = {
  date: string; // ISO date string
  type: 'training' | 'off'; // Possible values for type
  plan: PlanDetails | undefined; // Plan details, which can be undefined
};



export function getCalendarData(userData: User) {
  if (!userData.end || ! userData.training_days) return { err: "missing data..."}
  const start = userData.start ? new Date(userData.start) : new Date(); // Use the given start date or current date if not provided
  const end = new Date(userData.end);
  const { training_days} = userData;

  let plan: any[] = [];
  switch (userData.training_days.length) {
    case 3:
      plan = threeDPlan;
      break;
    case 4:
      plan = fourDPlan;
      break;
    case 5:
      plan = fiveDPlan;
      break;
    default:
      return { err: "Invalid number of training days." };
  }

  const Tplans: { [key: number]: any } = Object.fromEntries(
    training_days.map((day, index) => [day, {name: plan[index].name, id: plan[index].id}])
  );


  // Create a full week (0 = Sunday, 6 = Saturday)
  // const fullWeek = [0, 1, 2, 3, 4, 5, 6];

  
  // Create an interval from the start date to the end date
  const calendarDays = eachDayOfInterval({
    start: start,
    end: end ? new Date(end) : new Date(), // Use the given end date or current date if not provided
  });

  // Map calendarDays to training/rest days
  const calendar = calendarDays.map(day => {
    const dayOfWeek = (getDay(day) - 1 + 7) % 7;  // Get the day of the week (0 = Sunday, 6 = Saturday)
    return {
      date: day,
      type: training_days.includes(dayOfWeek)
        ? "training"
        : "off",
      plan: training_days.includes(dayOfWeek)
      ? Tplans[dayOfWeek]
      : "off",
    };
  });

  return calendar;
}


export async function getScheduleByUser(userData: User) {
  const schedule = userData.training_days;
  if (!schedule) {
    return { err: "No schedule found for this user." };
  }
  const calendarD = await getCalendarData(userData);
  return { schedule: calendarD } ;
}

export async function getAllUsers() {
  return await users.find({}).toArray();
}

export async function getUserByEmail(email: string) {
  return await users.findOne({ email: email });
}

export async function getUserCalendarBySessionId(sessionID: string) {
  const session = await sessions.findOne({ sessionID });
  if (!session) {
    return { err: "Session not found or expired." };
  }
  const user = await users.findOne({ email: session.email }) as User;
  if (!user) {
    return { err: "User not found." };
  }
  const schedule = await getScheduleByUser(user);
  return { schedule };
}

export async function getUserCalendarByReq(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  const { user, err } = await getUserBySessionId(sessionID);
  if (err) {
    return { err };
  }
  if (!user) {
    return { err: "User not found." };
  }
  const schedule = await getScheduleByUser(user as User);
  return { schedule };
}

export async function createUserSchedule(req: NextApiRequest) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionID = cookies.sessionID;
  const { user, err } = await getUserBySessionId(sessionID);
  if (err) {
    return { err };
  }
  if (!user) {
    return { err: "User not found." };
  }
  const ship = await getShipByEmail(user.email);
  if (!ship) {
    return { err: "MemberShip not found or expired." };
  }
  user.start = ship.start;
  user.end = ship.end;
  user.training_days = req.body.training_days;
  const upd = await updateUser(user._id, user as User);
  return { upd }
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
  const email_Valid = emailRegex.test(userData.email);
  if (!email_Valid) {
    return { err: "Invalid Email." };
  }
  // Validate email further using third party api
  userData.role = "user";
  userData.password = await bcrypt.hash(userData.password, 10);
  userData.created_at = new Date();
  await users.insertOne(userData);
  return { user: userData.email };
}

export async function loginUser(userData: Login_User) {
  const exist = await users.findOne({ email: userData.email });
  if (!exist) {
    return { err: "Email not found, Please Register." };
  }
  console.log(exist.password, userData.password);
  const valid = await bcrypt.compare(userData.password, exist.password);
  if (!valid) {
    return { err: "Wrong Password..." };
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

export async function updateUser(id: ObjectId, updateData: User) {
  return await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function deleteUser(id: string) {
  return await users.deleteOne({ _id: new ObjectId(id) });
}

// export function getUserBMI(user: User): number {
//   const { height, weight } = user;
//   if (!height || !weight) {
//     throw new Error("User's height and weight are required to calculate BMI.");
//   }
//   // BMI formula: weight (kg) / (height (m)^2)
//   const heightInMeters = height / 100; // Convert height from cm to meters
//   const bmi = weight / (heightInMeters * heightInMeters);
//   return parseFloat(bmi.toFixed(2)); // Round to 2 decimal places
// }

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100; // Assuming height is in centimeters
  return weight / (heightInMeters * heightInMeters);
};

export const getUserBMIBySessionId = async (sessionID: string) => {
  const session = await sessions.findOne({ sessionID });
  if (!session) {
    return { err: "Session not found or expired." };
  }
  const user = await users.findOne({ email: session.email }) as User;
  if (!user) {
    return { err: "User not found." };
  }
  const bmi = calculateBMI(user.weight, user.height);
  return { bmi };
};