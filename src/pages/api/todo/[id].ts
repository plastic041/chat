import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (method) {
    case "PATCH":
      try {
        const todo = await prisma.todo.update({
          where: {
            id: Number(id),
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
