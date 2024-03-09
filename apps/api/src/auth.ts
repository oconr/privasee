import { Router } from "express";
import { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import base from "./airtable";
const router = Router();

const table = base("Users");

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" }).end();
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required" }).end();
    return;
  }

  const records = await table
    .select({
      maxRecords: 1,
      filterByFormula: `{Email}="${email}"`,
    })
    .firstPage();

  if (records.length === 0) {
    res.status(401).json({ error: "Invalid email" }).end();
    return;
  }

  const user = records[0].fields;

  const hashTest = await hash(password, user.Salt!.toString());

  if (hashTest !== user.Password) {
    res.status(401).json({ error: "Invalid password" }).end();
    return;
  }

  const secret = process.env.JWT_SECRET ?? "";
  const token = sign({ email: user.Email }, secret, {
    expiresIn: "1d",
  });

  res
    .status(201)
    .json({
      session: token,
    })
    .end();
  return;
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" }).end();
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required" }).end();
    return;
  }

  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);

  await table.create([
    {
      fields: {
        Email: email,
        Password: hashedPassword,
        Salt: salt,
        "Created at": new Date().toISOString(),
        Name: name ?? "",
      },
    },
  ]);

  const secret = process.env.JWT_SECRET ?? "";
  const token = sign({ email }, secret, {
    expiresIn: "1d",
  });

  res
    .status(201)
    .json({
      session: token,
    })
    .end();
  return;
});

export default router;
