import express from "express";
import { connectToDevDB } from "./utils/connectToDevDB";
import { handleUnauthorizedError } from "./utils/handleUnauthorizedError";
const app = express();
connectToDevDB(app);
handleUnauthorizedError(app);
