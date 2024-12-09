import {createLogger, format , transports} from "wiston";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();


const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)


const logDirectory = path.join(_dirname,'log')
if(!fs.existsSync(logDirectory)){
    fs.mkdir(logDirectory)
}


export const logger = createLogger({
    level:'info',
    format:format.combine(
        format.timeStamp({format: 'YY:MM:DD HH:MM:SS' }),
        format.json()
    ),
    transports:[
        new transports.File({filename:path.join(logDirectory,'access.log') ,level:'info'}),
        new transports.File({filename:path.join(logDirectory,'combined.log')}),
        new transports.File({filename:path.join(logDirectory,'error.log'),level:'error'}),
        new transports.File({filename:path.join(logDirectory,'custom.log'),level:'warn'})
    ]
});


if(process.env.NODE_ENV !== 'production'){
    logger.add(
        new transports.console({
            format:format.combine(format.colorize,format.simple())
    })
    )
}