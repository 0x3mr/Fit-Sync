import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers, createUser, isAdmin } from '@/app/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { err, state } = isAdmin(req);
    if (err){
      return res.status(400).json({ err });
    }
    if (!state) return res.status(400).json({ err: "You ARE NOT ALLOWED DUDE" });
    const users = await getAllUsers();
    return res.status(200).json(users);
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
