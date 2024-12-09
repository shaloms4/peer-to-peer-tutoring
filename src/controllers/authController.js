import bcrypt from "bcrypt";
import { Student } from "../model/studentModel.js";
import { Tutor } from "../model/tutorModel.js";
import { sendVerifcationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/email.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../config/log.config.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const { name, email, password, role, subject, preferredMode, availability, location, address } = req.body;

    if (!['admin', 'student', 'tutor'].includes(role)) {
        return res.status(400).json({ success: false, message: "You must choose a valid role" });
    }

    try {
        if (role === 'student') {
            const student = await Student.findOne({ email });
            if (student) {
                return res.status(400).json({ success: false, message: `Account already created with ${email}` });
            }
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const hash = await bcrypt.hash(password, 10);
            const newStudent = new Student({
                name,
                email,
                password: hash,
                subject,
                preferredMode,
                address: preferredMode === 'inperson' ? address : undefined,
                location: preferredMode === "inperson" ? location : undefined,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
            });
            await newStudent.save();

            return res.status(201).json({ success: true, message: "Student account created successfully" });
        }

        if (role === 'tutor') {
            const tutor = await Tutor.findOne({ email });
            if (tutor) {
                return res.status(400).json({ success: false, message: `Account already created with ${email}` });
            }
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const hash = await bcrypt.hash(password, 10);
            const newTutor = new Tutor({
                name,
                email,
                password: hash,
                subject,
                availability,
                location,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
            });
            await newTutor.save();

            return res.status(201).json({ success: true, message: "Tutor account created successfully" });
        }

        return res.status(400).json({ success: false, message: "Role not yet implemented" });

    } catch (error) {
        logger.error(`Error during signup: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    const role = req.user.role;
    try {
        let user;
        if (role === 'student') {
            user = await Student.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            });
        } else if (role === 'tutor') {
            user = await Tutor.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() }
            });
        }

        if (!user) {
            logger.warn(`Verification token not found: ${code}`);
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        logger.info(`Email successfully verified: ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Congratulations! Your email has been verified.",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        logger.error(`Error during email verification: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Student.findOne({ email });
        if (!user) {
            user = await Tutor.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: `Account not found for ${email}` });
            }
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Your email is not verified. Please verify your email before logging in.",
            });
        }

        const token = generateToken(user._id);
        logger.info(`User logged in: ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: { ...user._doc, password: undefined }, 
        });
    } catch (error) {
        logger.error(`Error during login for ${email}: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await Student.findOne({ email });
        if (!user) {
            user = await Tutor.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; 
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        sendPasswordResetEmail(user.email, resetLink);

        logger.info(`Password reset email sent to: ${email}`);
        return res.status(200).json({
            success: true,
            message: "Password reset email has been sent.",
        });
    } catch (error) {
        logger.error(`Error during forgot password: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { code, password } = req.body;

    try {
        let user = await Student.findOne({
            resetToken: code,
            resetTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            user = await Tutor.findOne({
                resetToken: code,
                resetTokenExpiresAt: { $gt: Date.now() }
            });

            if (!user) {
                logger.warn(`Invalid or expired reset token: ${code}`);
                return res.status(404).json({ success: false, message: "Invalid or expired reset token" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save();

        sendPasswordResetSuccessEmail(user.email);
        logger.info(`Password successfully reset for user: ${user.email}`);

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully.",
        });
    } catch (error) {
        logger.error(`Error during password reset: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
