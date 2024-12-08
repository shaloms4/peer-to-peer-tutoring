import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const genrateToken = async(userId,res)=>{
    const token =  jwt.sign({_id:userId,role:userId.role},process.env.JWT_SECRET)

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production'
    });
    return token
}
