import {
    loginSchema,
} from "../shared/schema.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq, and, desc, inArray } from 'drizzle-orm';

import * as schema from "../shared/schema.js";


let login = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email, password } = loginSchema.parse(req.body);

        // Find user by email
        const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const user = users[0];

        // // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password :", password)
        console.log("user.password:", user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        // const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password :", password)
        // console.log("user.password:", user.password)
        // if (password != user.password) {
        //   return res.status(400).json({ message: "Invalid credentials" });
        // }

        // Set session
        req.session.userId = user.id;
        req.session.isAuthenticated = true;
        req.session.user = { id: user.id, name: user.name, email: user.email }; // Store some user info

        // Return user without password
        console.log('req.session.user', req.session)
        const { password: _, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.log("Login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default {
    login
};