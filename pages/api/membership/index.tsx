import { NextApiRequest, NextApiResponse } from "next";
import {
  createShip,
  Ship,
  deleteShip,
  updateShipPlan,
  updateShipStatus,
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

    } else if (req.method === "PUT") {
      // PUT: Update an existing ship (membership)
      const { err, user } = await getUserByReq(req);
      if (err || !user) {
        return res.status(400).json({ err });
      }

      const email = user.email;

      try {
        // Here you will update the fields based on the req.body input
        let updates = {}
        let err2, ship
        if (req.body.type){
          updates = {type: req.body.type};
          ({ err: err2, ship } = await updateShipPlan(email, updates));
        }
        else if (req.body.status){
          updates = {status: req.body.status};
          ({ err: err2, ship } = await updateShipStatus(email, updates));
        }

        if (err2 || !ship) {
          return res.status(400).json({ err: err2 });
        }

        return res.status(200).json(ship);
      } catch (error) {
        return res.status(500).json({ error: "Failed to update membership" });
      }

    } else if (req.method === "DELETE") {
      // DELETE: Delete an existing ship (membership)
      const { err, user } = await getUserByReq(req);
      if (err || !user) {
        return res.status(400).json({ err });
      }

      const email = user.email;

      try {
        const { err: err3, del } = await deleteShip(email);
        if (err3 || !del) {
          return res.status(400).json({ err: err3 });
        }

        return res.status(200).json({ message: "Membership deleted successfully" });
      } catch (error) {
        return res.status(500).json({ error: "Failed to delete membership" });
      }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
