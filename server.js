import app from './app.js';
import dotenv from "dotenv";
dotenv.config();
import {connectToDb} from "./src/config/db.config.js";


connectToDb.then(()=>{
    app.listen(process.env.PORT,()=>{
        logger.info(`server is listening on the port${process.env.PORT}`)
    })
}).catch((error)=>logger.error(`server failed to listen on port${process.env.PORT}`,error))