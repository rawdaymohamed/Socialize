import "dotenv/config";

export const dbSetting = {
  test: {
    url: process.env.DATABASE_TEST_URL,
  },
  development: {
    url: process.env.DATABASE_URL,
  },
};
