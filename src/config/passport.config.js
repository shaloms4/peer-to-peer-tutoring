import passport from 'passport';
import GoogleStrategy from "passport-google-oauth20";
import { Student } from "../model/studentModel.js";
import { Tutor } from "../model/tutorModel.js";
import dotenv from "dotenv";

dotenv.config();
passport.use(
  'student-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/student/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let student = await Student.findOne({ googleId: profile.id });

        if (!student) {
          student = new Student({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true,
            accessToken:accessToken,
            refreshToken:refreshToken,
          });
          await student.save();
        }

        done(null, student);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
passport.use(
  'tutor-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/tutor/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let tutor = await Tutor.findOne({ googleId: profile.id });

        if (!tutor) {
          tutor = new Tutor({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true,
            acessToken:accessToken,
            refreshToken:refreshToken
          });
          await tutor.save();
        }

        done(null, tutor);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
