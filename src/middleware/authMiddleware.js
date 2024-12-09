import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {Student} from "../model/studentModel.js";
import {Tutor} from "../model/tutorModel.js"
dotenv.config();


export const authenticateToken = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1]
    jwt.verify(token,process.env.JWT_KEY,async(err,decodeduser)=>{
        let user = Student.findOne({_id:decodeduser._id})
        if(!user){
            user = await Tutor.findOne({_id:decodeduser._id})
            if(!user){
                res.status(404).json({success:false,message:"User not found"})
            }
        }else if(err){
            res.status(401).json({sucess:false,message:'Invalid Token'})
        }
        req.user = decodeduser
        next()
    })
}