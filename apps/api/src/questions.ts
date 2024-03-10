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

router.get("/unanswered", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    verify(session, secret);
    const records: any[] = [];

    await table
      .select({
        filterByFormula: `{Answer}=""`,
      })
      .eachPage((data, fetchNextPage) => {
        records.push(...data);
        fetchNextPage();
      });

    console.log(records);

    res.status(200).json(records).end();
    return;
  } catch {
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

router.get("/:id", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";
  const questionId = req.params.id;

  try {
    verify(session, secret);
    const records: any[] = [];

    await table
      .select({
        maxRecords: 1,
        filterByFormula: `{_recordId}=${questionId}`,
      })
      .eachPage((data, fetchNextPage) => {
        records.push(...data);
        fetchNextPage();
      });

    if (records.length === 0) {
      res.status(404).json({ error: "Question not found" }).end();
      return;
    }

    res.status(200).json(records[0]).end();
    return;
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

router.post("/new", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    const decoded = verify(session, secret) as { email: string };
    const createdBy =
      req.body.delegateTo === null ? decoded.email : req.body.delegateTo;

    const records = await table.create([
      {
        fields: {
          "Company name": req.body.companyName,
          _companyId: parseInt(req.body.companyId),
          Question: req.body.question,
          Answer: req.body.answer,
          "Created at": new Date().toISOString(),
          "Created by": createdBy,
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

router.patch("/", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    const decoded = verify(session, secret) as { email: string };

    const records: any[] = [];

    await table
      .select({
        filterByFormula: `{_recordId}=${req.body.questionId}`,
        maxRecords: 1,
      })
      .eachPage((data, fetchNextPage) => {
        records.push(...data);
        fetchNextPage();
      });

    await table.update(
      records.map((record) => ({
        id: record.id,
        fields: {
          "Company name": req.body.companyName,
          _companyId: parseInt(req.body.companyId),
          Question: req.body.question,
          Answer: req.body.answer,
          "Updated at": new Date().toISOString(),
          "Updated by": decoded.email,
          "Assigned to": req.body.assignedTo,
          Properties: req.body.properties,
          Description: req.body.description,
        },
      }))
    );

    res.status(200).end();
    return;
  } catch {
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

router.delete("/", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    verify(session, secret);
    const selectedIds = req.body.selectedIds as string[];

    const records: any[] = [];
    const formula = `OR(${selectedIds
      .map((id) => `{_recordId}=${id}`)
      .join(",")})`;

    await table
      .select({
        filterByFormula: formula,
      })
      .eachPage((data, fetchNextPage) => {
        records.push(...data);
        fetchNextPage();
      });

    await table.destroy(records.map((record) => record.id));
    res.status(200).end();
    return;
  } catch {
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

router.patch("/assign", async (req, res) => {
  const session = req.cookies.session_jwt;
  const secret = process.env.JWT_SECRET ?? "";

  try {
    const decoded = verify(session, secret) as { email: string };
    const selectedIds = req.body.selectedIds as string[];
    const assignee = req.body.assignee as string;

    const records: any[] = [];
    const formula = `OR(${selectedIds
      .map((id) => `{_recordId}=${id}`)
      .join(",")})`;

    await table
      .select({
        filterByFormula: formula,
      })
      .eachPage((data, fetchNextPage) => {
        records.push(...data);
        fetchNextPage();
      });

    await table.update(
      records.map((record) => ({
        id: record.id,
        fields: {
          "Assigned to": assignee,
          "Updated at": new Date().toISOString(),
          "Updated by": decoded.email,
        },
      }))
    );

    res.status(202).end();
    return;
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid session" }).end();
    return;
  }
});

export default router;
