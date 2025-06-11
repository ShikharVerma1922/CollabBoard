import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      "💻 MongoDB connected!! DB Host: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(`Error connecting to mongoDB:\n`, error);
    process.exit(1);
  }
}
