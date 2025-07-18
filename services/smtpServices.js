import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


export const sendMail = (payload) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: process.env.SMTP_SECURE_PORT || 465,
        secure: true, // true for port 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: '"Team FurnitureByPanchal" <no-reply@furniturebypanchal.com>',
        to: payload.to || 'ab.sharma@thesynapses.com',
        subject: payload.subject || 'Test Email from Node.js using Brevo',
        html: payload.html || "<h1>Hello from Brevo SMTP</h1><p>This is a test email sent using Nodemailer with Brevo SMTP.</p>",
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error:', error);
        }
        console.log('Email sent:', info.response);
    });

}