// app/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById, updateUser, deleteUser } from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await getUserById(id as string);
    return res.status(200).json(user);
  } else if (req.method === 'PUT') {
    const updatedUser = await updateUser(id as string, req.body);
    return res.status(200).json(updatedUser);
  } else if (req.method === 'DELETE') {
    await deleteUser(id as string);
    return res.status(204).end();
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
