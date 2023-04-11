import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/prisma";
import { users } from "@clerk/nextjs/api";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const { method } = req;

  const user = await users.getUser(userId as string);

  switch (method) {
    case "GET":
      try {
        const pinged = await prisma.ping.findMany({
          where: {
            senderId: user.id,
          },
        });
        const recieved = await prisma.ping.findMany({
          where: {
            recieverId: user.id,
          },
        });
        return res.status(200).json({ pinged, recieved });
      } catch (e) {
        console.error("Request error", e);
        return res.status(500).json({ error: "Error fetching posts" });
      }
    case "POST":
      const { recieverId } = req.body;

      if (!recieverId) {
        return res.status(400).json({ error: "Missing recieverId" });
      }

      const foundReciever = await prisma.user.findUnique({
        where: {
          id: recieverId,
        },
      });

      if (!foundReciever) {
        return res.status(400).json({ error: "Reciever not found" });
      }

      try {
        const ping = await prisma.ping.create({
          data: {
            senderId: user.id,
            senderUsername: user.username || user.id,
            recieverId,
            recieverUsername: foundReciever.username || foundReciever.id,
          },
        });
        return res.status(201).json(ping);
      } catch (e) {
        console.error("Request error", e);
        return res.status(500).json({ error: "Error creating post" });
      }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
