import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import AuthRouter from "./auth";
import QuestionRouter from "./questions";
import CompanyRouter from "./companies";
import UserRouter from "./users";

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/questions", QuestionRouter);
app.use("/companies", CompanyRouter);
app.use("/users", UserRouter);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`api running at port ${port}`);
});
