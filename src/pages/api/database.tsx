import { db } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const client = await db.connect();
  switch (request.method) {
    case "POST":
      const { id, type, timestamp, from_acc, to_acc, amount } = JSON.parse(
        request.body
      );
      try {
        await client.sql`INSERT INTO transactions (id, type, timestamp, from_acc, to_acc, amount) VALUES (${id}, ${type}, ${timestamp}, ${from_acc}, ${to_acc}, ${amount});`;
      } catch (error) {
        return response.status(500).json({ error });
      }
      return;
    case "GET":
      const SQL = String(request.query["wallet"]);
      try {
        const transactions =
          await client.sql`SELECT * FROM transactions WHERE from_acc=${SQL};`;
        return response.status(200).json({ transactions });
      } catch (error) {
        console.log(error);
        return response.status(500).json({ error });
      }
  }
}
