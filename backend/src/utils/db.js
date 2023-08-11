import mongoose from "mongoose";
import { dbSetting } from "./dbSettings.js";
export const connectToMongoose = () => {
  const env = process.env.NODE_ENV || "test";
  const mongoString = dbSetting[env].url;
  mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to database");
  });
};
