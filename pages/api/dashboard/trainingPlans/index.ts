import { NextApiRequest, NextApiResponse } from "next";
import db from "@/app/lib/manga"; // Import the database connection from your existing file

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { trainingPlans } = req.body;

      const collection = db.collection("trainingPlans");

      await collection.insertMany(trainingPlans);

      res.status(200).json({ message: "Training plans inserted successfully" });
    } catch (error) {
      console.error("Error inserting training plans:", error);
      res.status(500).json({ message: "Error inserting training plans" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
