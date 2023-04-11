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

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!foundUser) {
    const user = await users.getUser(userId as string);

    await prisma.user.create({
      data: {
        id: userId,
        username: user.username || userId,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const userIds = await prisma.user.findMany({
          where: {
            id: {
              not: userId,
            },
          },
        });
        return res.status(200).json({ users: userIds.map((user) => user.id) });
      } catch (e) {
        console.error("Request error", e);
        return res.status(500).json({ error: "Error fetching posts" });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
