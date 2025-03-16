import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Successfully connected  db")
      } catch (error) {
        console.log("error connecting db",error)
      }
}

export default connectDb
