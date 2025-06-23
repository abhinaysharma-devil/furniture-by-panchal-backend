import {
    loginSchema,
} from "../shared/schema.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq, and, desc, inArray } from 'drizzle-orm';

import * as schema from "../shared/schema.js";

let authServices = {
    getUserByEmail: async (payload, res) => {
        try {
            const db = payload.req.app.locals.db;
            const { email } = payload;

            // Find user by email
            return await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: error.errors });
            } else {
                console.log("Login error:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}
