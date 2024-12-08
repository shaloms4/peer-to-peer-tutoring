import bcrypt from "bcrypt";
import { Student } from "../model/studentModel.js";
import { Tutor } from "../model/tutorModel.js";

export const signup = async (req, res) => {
    const { name, email, password, role, subject, prefferedMode, availablity, location, address } = req.body;

    if (!['admin', 'student', 'tutor'].includes(role)) {
        return res.status(400).json({ success: false, message: "You must choose a valid role" });
    }

    try {
        if (role === 'student') {
            const student = await Student.findOne({ email });
            if (student) {
                return res.status(400).json({ success: false, message: `Account already created with ${email}` });
            }

            const hash = await bcrypt.hash(password, 10);
            const newStudent = new Student({
                name,
                email,
                password: hash,
                subject,
                prefferedMode,
                address:prefferedMode === 'inperson' ? address:undefined,
                location:prefferedMode === "inperson" ? location:undefined,
            });
            await newStudent.save();

            return res.status(201).json({ success: true, message: "Student account created successfully" });
        }

        if (role === 'tutor') {
            const tutor = await Tutor.findOne({ email });
            if (tutor) {
                return res.status(400).json({ success: false, message: `Account already created with ${email}` });
            }

            const hash = await bcrypt.hash(password, 10);
            const newTutor = new Tutor({
                name,
                email,
                password: hash,
                subject,
                availablity,
                location,
            });
            await newTutor.save();

            return res.status(201).json({ success: true, message: "Tutor account created successfully" });
        }
        return res.status(400).json({ success: false, message: "Role not yet implemented" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
