import express from "express";
import {
    addSubsEmail,sendMailToAdmin
} from "../controller/otherStuffController.js";

// API Routes
const router = express.Router();

export const otherStuff = function () {

    router.post("/addSubsEmail", addSubsEmail);

    router.post("/sendMail", sendMailToAdmin);

    return router;
}