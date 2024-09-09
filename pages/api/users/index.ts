import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers, createUser } from '@/app/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } else if (req.method === 'POST') {
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
