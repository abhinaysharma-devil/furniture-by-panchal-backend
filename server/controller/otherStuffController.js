import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function addSubsEmail(req, res) {
    try {

        const { email } = req.body;


        await universalDao.addSubsEmail({ email, created_at: new Date() });

        res.status(201).json({ message: "Subscription email added successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Create order error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
