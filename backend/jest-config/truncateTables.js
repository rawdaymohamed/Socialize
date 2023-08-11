import { connectToMongoose } from "../src/utils/db.js";
beforeAll(() => {
  connectToMongoose();
  console.log("connected to mongoose test database");
});
// beforeEach(async () => {});
