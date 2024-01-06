import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";

export const web = express();
web.use(express.json());
// web.use(express.urlencoded());
// route
web.use(publicRouter);
web.use(userRouter);

// error
web.use(errorMiddleware);
