import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser, createUser, logoutUser } from '@/app/models/User';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { err, sessionID} = await loginUser(req.body);
    if (err){
      return res.status(400).json({ err });
    }
    res.setHeader('Set-Cookie', `sessionID=${sessionID}; Path=/; HttpOnly; Secure; SameSite=Strict`);
    return res.status(200).json(sessionID);
  } else if (req.method === 'POST') {
    const { err, user } = await createUser(req.body);
    if (err){
      return res.status(400).json({ err });
    }
    return res.status(201).json({ email: user });
  } else if (req.method === 'DELETE') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionID = cookies.sessionID;
    if (!sessionID){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { state } = await logoutUser(sessionID);
    return res.status(200).json({ state });
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
