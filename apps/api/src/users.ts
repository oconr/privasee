import { Router } from "express";
import base from "./airtable";
import { verify } from "jsonwebtoken";

const router = Router();
const table = base("Users");

router.get("/list", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    verify(session, secret);

    const records: any[] = [];
    await table.select().eachPage((data, fetchNextPage) => {
      records.push(...data);
      fetchNextPage();
    });

    res.status(200).json(records).end();
    return;
  } catch (error) {
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

export default router;
