import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/prisma";
import { users } from "@clerk/nextjs/api";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  const { userId } = getAuth(req);

  if (!userId) {
    res.status(400).json({ error: "Missing userId" });
    return;
  }

  const user = await users.getUser(userId as string);

  switch (method) {
    case "GET":
      try {
        const todos = await prisma.todo.findMany({
          where: {
            userId: user.id,
          },
        });
        res.status(200).json(todos);
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({ error: "Error fetching posts" });
      }
      break;
    case "POST":
      try {
        const todo = await prisma.todo.create({
          data: {
            title: req.body.title,
            userId: user.id,
          },
        });
        res.status(201).json(todo);
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({ error: "Error creating post" });
      }
      break;
    case "PUT":
      try {
        const todo = await prisma.todo.update({
          where: {
            id: req.body.id,
          },
          data: {
            title: req.body.title,
            completed: req.body.completed,
          },
        });
        res.status(200).json(todo);
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({ error: "Error updating post" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
