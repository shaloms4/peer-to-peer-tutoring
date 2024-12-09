import {signup,login,resetPassword,forgotPassword,verifyEmail,logOut} from "../controllers/authController.js";
import {Router} from "express";
import passport from "passport";
import { generateTokenandsetCookie } from "../utils/jwt.js";
const router = Router();
router.get("/google",
    passport.authenticate("google",{scope:["profile","email"]})
)

router.get("/google/callback",
    passport.authenticate("google",{failureRedirect:"/auth/login"}),
    async(req,res)=>{
        await generateTokenandsetCookie(res,req,user._id)
        res.redirect("/")
    }
)

router.post("/signup",signup);
router.post("/login",login);
router.post("/forgotpassword",forgotPassword);
router.post("/resetpassword",resetPassword);
router.post("/verifyemail",verifyEmail)
router.delete("/logout",logOut);
export default router;