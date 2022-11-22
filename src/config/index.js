import dotenv from "dotenv";
dotenv.config();
const config = {
  app: {
    port: process.env.APP_PORT,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};
export default config;
