import { Router } from "express";
import base from "./airtable";
import { verify } from "jsonwebtoken";

const router = Router();
const table = base("Questions");

router.get("/me", async (req, res) => {
  const session = req.cookies.session_jwt;

  const secret = process.env.JWT_SECRET ?? "";
  try {
    const decoded = verify(session, secret) as { email: string };
    const records: any[] = [];

    await table
      .select({
        filterByFormula: `{Assigned to}="${decoded.email}"`,
      })
      .eachPage((data, fetchNextPage) => {
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
  } catch {
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

router.post("/new", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    const decoded = verify(session, secret) as { email: string };

    const records = await table.create([
      {
        fields: {
          "Company name": req.body.companyName,
          _companyId: parseInt(req.body.companyId),
          Question: req.body.question,
          Answer: req.body.answer,
          "Created at": new Date().toISOString(),
          "Created by": decoded.email,
          "Assigned to": req.body.assignedTo,
          Properties: req.body.properties,
          Description: req.body.description,
        },
      },
    ]);

    const record = records[0];

    res.status(201).json(record).end();
    return;
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

export default router;
