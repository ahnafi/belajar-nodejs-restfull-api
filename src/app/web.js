import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();
web.use(express.json());
web.use(express.urlencoded());
web.use(errorMiddleware);
