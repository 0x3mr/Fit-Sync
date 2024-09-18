import { NextApiRequest, NextApiResponse } from 'next';
import { createShip, Ship } from '@/app/models/Memberships';
import { getUserByReq } from '@/app/models/User';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { err, user} = await getUserByReq(req);
    if (err || !user){
      return res.status(400).json({ err });
    }

    const newShip: Ship = {
        email: user.email,
        type: req.body.plan,
        status: "ongoing",
        start: new Date,
        end: new Date,
        pause_limit: 3
    }
    const { err: err1, ship } = await createShip(newShip)
    if (err1 || !ship){
        return res.status(400).json({ err: err1 });
    }
    return res.status(200).json(ship);
//   } else if (req.method === 'DELETE') {

} else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
