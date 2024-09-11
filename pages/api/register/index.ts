import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser, createUser, logoutUser } from '@/app/models/User';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { err, user } = await createUser(req.body);
    if (err){
      return res.status(400).json({ err });
    }
    return res.status(201).json({ email: user });
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
