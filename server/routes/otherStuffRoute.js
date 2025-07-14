import express from "express";
import {
    addSubsEmail,
} from "../controller/otherStuffController.js";

// API Routes
const router = express.Router();

export const otherStuff = function () {
    router.post("/addSubsEmail", addSubsEmail);

    return router;
}