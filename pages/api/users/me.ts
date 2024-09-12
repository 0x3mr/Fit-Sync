import { NextApiRequest, NextApiResponse } from "next";
import { getUserByReq } from "@/app/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user = await getUserByReq(req);
    return res.status(200).json(user);
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
