// import { NextApiRequest, NextApiResponse } from "next";
// import { getUserById, updateUser, deleteUser } from "@/app/models/User";
// import { ObjectId } from "mongodb";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { id } = req.query;

//   const loggedInUserId = req.headers["user-id"];

//   if (loggedInUserId !== id) {
//     return res
//       .status(403)
//       .json({ error: "You are not authorized to modify this user." });
//   }

//   if (req.method === "GET") {
//     const user = await getUserById(id as string);
//     return res.status(200).json(user);
//   // } else if (req.method === "PUT") {
//   //   const updatedUser = await updateUser(new ObjectId(id), req.body);
//   //   return res.status(200).json(updatedUser);
//   } else if (req.method === "DELETE") {
//     await deleteUser(id as string);
//     return res.status(204).end();
//   } else {
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
