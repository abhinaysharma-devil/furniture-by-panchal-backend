import { universalDao } from "../dao/universalDao.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import randomInteger from 'random-int';
import { sendMail } from "../../services/smtpServices.js";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../templates/mailTemplates.js";

export async function userLogin(req, res) {
    try {

        const userData = req.body

        // Check if user already exists
        const existingUsers = await universalDao.getUserByEmail({ email: userData.email });
        if (existingUsers.length === 0) {
            return res.status(409).json({ message: "User with this email does not exist" });
        }

        const userRecord = existingUsers[0]; // Get the first user record

        // Compare passwords
        const isMatch = await bcrypt.compare(userData.password, userRecord.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const { password: _, ...userWithoutPassword } = existingUsers[0];

        const user = userWithoutPassword;

        jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error("JWT signing error:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.json({ user: userWithoutPassword, token });
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid user data", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function userSignup(req, res) {
    try {

        const userData = req.body

        // Check if user already exists
        const existingUsers = await universalDao.getUserByEmail({ email: userData.email });
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const randomOtp = randomInteger(1000, 9999);

        // Create user
        const newUsers = await universalDao.createUser({
            ...userData,
            otp: randomOtp,
            password: hashedPassword,
            is_otp_verified: 0 // Initialize OTP verification status
        });

        sendMail({
            to: userData.email,
            subject: "Furniture By Panchal - OTP Verification",
            html: otpTemplate(randomOtp)
        });

        res.status(201).json({ message: "Otp Send to your Mail", data: newUsers[0] });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid user data", errors: error.errors });
        }
        console.error("Create user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyOtp(req, res) {
    try {

        const userData = req.body

        // Check if user already exists
        const existingUsers = await universalDao.getUserByEmail({ email: userData.email });
        if (existingUsers.length === 0) {
            return res.status(409).json({ message: "User with this email does not exist" });
        }

        const userRecord = existingUsers[0];

        if (userRecord.otp != userData.otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await universalDao.updateOtpStatus({ userId: existingUsers[0].id });

        const { password: _, ...userWithoutPassword } = existingUsers[0];

        const user = userRecord;

        jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error("JWT signing error:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.json({ user: userWithoutPassword, token });
        });

    } catch (error) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid user data", errors: error.errors });
        }
        console.error("Create user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/user/list
export async function listUsers(req, res) {
    try {

        const users = await universalDao.getUsers();
        // Filter out password from each user object
        const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
        res.status(200).json(usersWithoutPasswords);
    } catch (error) {
        console.error("List users error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/user/:id
export async function getUser(req, res) {
    try {
        // const userId = parseInt(req.params.id);
        // if (isNaN(userId)) {
        //     return res.status(400).json({ message: "Invalid user ID" });
        // }

        const users = await universalDao.getUserById({ id: req.params.id });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not foundff" });
        }

        const { password: _, ...userWithoutPassword } = users[0];
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/user/add
export async function createUser(req, res) {
    try { // Removed Drizzle schema validation
        const userData = req.body;

        // Check if user already exists
        const existingUsers = await universalDao.getUserByEmail({ email: userData.email });
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create user
        const newUsers = await universalDao.createUser({
            ...userData,
            password: hashedPassword,
            is_otp_verified: 0 // Initialize OTP verification status
        });
        if (newUsers.length === 0) {
            return res.status(500).json({ message: "Failed to create user" });
        }

        res.status(201).json(newUsers[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid user data", errors: error.errors });
        }
        console.error("Create user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/user/:id
export async function updateUser(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { name, email, mobile } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const updatedUsers = await universalDao.updateUserById({ userId, ...updateData });

        if (updatedUsers.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password: _, ...userWithoutPassword } = updatedUsers[0];
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/user/:id
export async function deleteUser(req, res) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const deletedUsers = await universalDao.deleteUserById({ userId });
        if (deletedUsers.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}