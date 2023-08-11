import { connectToMongoose } from "./db.js";

export const connectToDevDB = (app) => {
  if (process.env.NODE_ENV !== "test") {
    connectToMongoose(app);
    startServer(app);
  }
};
const startServer = (app) => {
  app.listen(4000, () => {
    console.log("Socialize listening on port 4000!!");
  });
};
