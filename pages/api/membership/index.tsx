import { NextApiRequest, NextApiResponse } from "next";
import {
  createShip,
  Ship,
  updateShip,
  deleteShip,
} from "@/app/models/Memberships";
import { getUserByReq } from "@/app/models/User";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { err, user } = await getUserByReq(req);
    if (err || !user) {
      return res.status(400).json({ err });
    }

    const newShip: Ship = {
      email: user.email,
      type: req.body.plan,
      status: "ongoing",
      start: new Date(),
      end: new Date(), // This might be calculated based on the plan duration
      pause_limit: 3,
    };
    const { err: err1, ship } = await createShip(newShip);
    if (err1 || !ship) {
      return res.status(400).json({ err: err1 });
    }
    return res.status(200).json(ship);

    // } else if (req.method === "PUT") {
    //   // PUT: Update an existing ship (membership)
    //   const { err, user } = await getUserByReq(req);
    //   if (err || !user) {
    //     return res.status(400).json({ err });
    //   }

    //   const email = user.email;

    //   try {
    //     // Here you will update the fields based on the req.body input
    //     const updates = {
    //       // Add the fields you want to update, e.g., status, type, etc.
    //       // status: req.body.status,
    //       // end: new Date(req.body.end), // Example of updating the end date
    //       // pause_limit: req.body.pause_limit
    //     };

    //     const { err: err2, ship } = await updateShip(email, updates);
    //     if (err2 || !ship) {
    //       return res.status(400).json({ err: err2 });
    //     }

    //     return res.status(200).json(ship);
    //   } catch (error) {
    //     return res.status(500).json({ error: "Failed to update membership" });
    //   }

    // } else if (req.method === "DELETE") {
    //   // DELETE: Delete an existing ship (membership)
    //   const { err, user } = await getUserByReq(req);
    //   if (err || !user) {
    //     return res.status(400).json({ err });
    //   }

    //   const email = user.email;

    //   try {
    //     const { err: err3, deletedShip } = await deleteShip(email);
    //     if (err3 || !deletedShip) {
    //       return res.status(400).json({ err: err3 });
    //     }

    //     return res.status(200).json({ message: "Membership deleted successfully" });
    //   } catch (error) {
    //     return res.status(500).json({ error: "Failed to delete membership" });
    //   }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
