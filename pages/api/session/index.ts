import { NextApiRequest, NextApiResponse } from 'next';
import { isValidSession } from '@/app/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const code = await isValidSession(req);
    return res.status(200).json({ code });
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
