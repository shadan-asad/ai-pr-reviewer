import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  apiKey: process.env.API_KEY as string,
  dbUri: process.env.DB_URL!,
  redisUrl: process.env.REDIS_URL as string
};
