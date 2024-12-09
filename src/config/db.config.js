import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import logger from "./log.config.js"



export const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info("Connected to the database successfully")
    } catch (error) {
        logger.error("unable to connnect to the database")
        process.exit(1)
    }
}


export default connectToDb;