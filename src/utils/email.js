import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./mailTemplate";
import dotenv from "dotenv";
import logger from "./logger"; 
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.Email,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    try {
        const mail = {
            from: `"Peer to Peer Learning" <${process.env.Email}>`,
            to: recipientEmail,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };
        await transporter.sendMail(mail);
        logger.info(`Verification email sent successfully to ${recipientEmail}`);
    } catch (error) {
        logger.error(`Error while sending verification email: ${error.message}`);
        throw error;
    }
};

export const sendPasswordResetEmail = async (recipientEmail, resetURL) => {
    try {
        const mail = {
            from: `"Peer to Peer Learning" <${process.env.Email}>`,
            to: recipientEmail,
            subject: "Password Reset Request",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };
        await transporter.sendMail(mail);
        logger.info(`Password reset email sent successfully to ${recipientEmail}`);
    } catch (error) {
        logger.error(`Error while sending password reset email: ${error.message}`);
        throw error;
    }
};

export const sendPasswordResetSuccessEmail = async (recipientEmail) => {
    try {
        const mail = {
            from: `"Peer to Peer Learning" <${process.env.Email}>`,
            to: recipientEmail,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        };
        await transporter.sendMail(mail);
        logger.info(`Password reset success email sent successfully to ${recipientEmail}`);
    } catch (error) {
        logger.error(`Error while sending password reset success email: ${error.message}`);
        throw error;
    }
};
