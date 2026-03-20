import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"
import { clientConcernTemplate } from "../templates/mailTemplates.js";
import { sendMail } from "../../services/smtpServices.js";


export async function addSubsEmail(req, res) {
    try {

        const { email } = req.body;

        await universalDao.addSubsEmail({ email, created_at: new Date().toISOString() }); // Use ISO string for date

        res.status(201).json({ message: "Subscription email added successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Add subscription email error:", error); // More specific error message
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function sendMailToAdmin(req, res) {
    try {

        const mailData = req.body;

        sendMail({
            to: "panchalabhinay@gmail.com",
            subject: "Client Concern - " + mailData.subject,
            html: clientConcernTemplate(mailData)
        });

        res.status(201).json({ message: "We'll reach out to you shortly" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Send mail to admin error:", error); // More specific error message
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
