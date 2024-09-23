import { NextApiRequest, NextApiResponse } from "next";
import { createTrainingSchedule, getScheduleByUser } from "@/app/models/Training";
import { getUserByReq } from "@/app/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { err, user } = await getUserByReq(req);
        if (err || !user) {
            return res.status(400).json({ err });
        }

        const { schedule } = await getScheduleByUser(user.email);
        if (!schedule) {
            return res.status(400).json({ err: "Not found" });
        }

        return res.status(200).json(schedule);
    }
    else if (req.method === "POST") {
        const { err, user } = await getUserByReq(req);
        if (err || !user) {
            return res.status(400).json({ err });
        }

        const scheduleData = {
            email: user.email,
            training_days: req.body.training_days,  // Array of integers representing days
            schedule_pattern: req.body.schedule_pattern, // e.g. 4 days on, 3 days off
            weekend_type: req.body.weekend_type, // Weekend type, e.g., "fri-sat-sun"
        };

        const { err: err1, schedule } = await createTrainingSchedule(scheduleData);
        if (err1 || !schedule) {
            return res.status(400).json({ err: err1 });
        }

        return res.status(200).json(schedule);
    }
    else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
