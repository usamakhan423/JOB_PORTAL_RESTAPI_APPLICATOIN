import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// Imports both the database and routes
import connectDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";

// Config .env file
dotenv.config();
connectDB();

// assign the whole express elements in one variable name as app & create a PORT
const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(express.json());
// to secure the header section
app.use(helmet());

// Protect mongodb database
app.use(mongoSanitize());
// sanitize user input coming from POST body, GET queries, and url params
app.use(xss());
app.use(cors());
app.use(morgan("dev"));
app.use(errorMiddleware);

// enable routes
app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
