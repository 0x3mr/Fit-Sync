import { ObjectId } from "mongodb";
import db from "../lib/manga";
import { addDays, getDay, eachDayOfInterval, startOfWeek } from 'date-fns';
import { NextApiRequest } from "next";
import cookie from "cookie";
import { getShipByEmail } from "./Memberships";

const trainingSchedules = db.collection("training_prefs");
const sessions = db.collection("sessions");

export interface TrainingSchedule {
  _id?: ObjectId;
  email?: string;
  training_days: number[]; // List of days (0-6 representing Sun-Sat) the user will train
  rest_days?: number[];
  schedule_pattern: "2-train-break-2" | "4-straight-break";
  weekend_type: "fri-sat-sun" | "wed-thu-fri" | "thu-fri-sat";
  created_at?: Date;
  start?: Date;
  end?: Date;
}



export function getCalendarData(schedule: TrainingSchedule) {
  const { end, training_days, schedule_pattern, weekend_type } = schedule;
  const start = schedule.start ? new Date(schedule.start) : new Date(); // Use the given start date or current date if not provided

  // Define weekend based on the user's choice
  let weekend = [];
  switch (weekend_type) {
    case "fri-sat-sun":
      weekend = [5, 6, 0]; // Fri, Sat, Sun
      break;
    case "wed-thu-fri":
      weekend = [3, 4, 5]; // Wed, Thu, Fri
      break;
    case "thu-fri-sat":
      weekend = [4, 5, 6]; // Thu, Fri, Sat
      break;
  }

  // Create a full week (0 = Sunday, 6 = Saturday)
  const fullWeek = [0, 1, 2, 3, 4, 5, 6];

  // Compute rest days by removing training days and weekend days from the full week
  const rest_days = fullWeek.filter(day => !training_days.includes(day) && !weekend.includes(day));
  
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
        : rest_days.includes(dayOfWeek)
        ? "rest"
        : weekend.includes(dayOfWeek)
        ? "weekend"
        : "off",
    };
  });

  return calendar;
}

export async function getAllSchedules() {
  return await trainingSchedules.find({}).toArray();
}

export async function getScheduleByUser(email: string) {
  const schedule = await trainingSchedules.findOne({ email: email });
  if (!schedule) {
    return { err: "No schedule found for this user." };
  }
  const ship = await getShipByEmail(email);
  if (!ship) {
    return { err: "MemberShip not found or expired." };
  }
  schedule.end = ship.end;
  const calendarD = await getCalendarData(schedule as TrainingSchedule);
  return { schedule: calendarD } ;
}


export async function getScheduleBySessionId(sessionID: string) {
    const session = await sessions.findOne({ sessionID });
    if (!session) {
      return { err: "Session not found or expired." };
    }
    const {err, schedule} = await getScheduleByUser(session.email);
    if (!schedule) {
      return { err: err };
    }
    return { schedule };
}

export async function getScheduleByReq(req: NextApiRequest) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionID = cookies.sessionID;
    const { schedule, err } = await getScheduleBySessionId(sessionID);
    if (!schedule) {
      return { err: err};
    }
    return { schedule };
}

export async function createTrainingSchedule( scheduleData: TrainingSchedule) {
  const schedule = await trainingSchedules.findOne({ email:  scheduleData.email });
  console.log(scheduleData);
  if (schedule) {
    return { err: "Schedule Data already exists for this user." };
  }

  scheduleData.created_at = new Date();
  await trainingSchedules.insertOne(scheduleData);
  return { schedule: scheduleData };
}

export async function updateTrainingSchedule(email: string, updateData: Partial<TrainingSchedule>) {
  return await trainingSchedules.updateOne(
    { email: email },
    { $set: updateData }
  );
}

export async function deleteTrainingSchedule(email: string) {
  return await trainingSchedules.deleteOne({ email: email });
}
