import express from "express";
import {
    createOrderRzp,
    verifyPaymentRzp
} from "../controller/paymentController.js";

// API Routes
const router = express.Router();

export const paymentRoutes = function () {
    router.post("/create-order", createOrderRzp);
    router.post("/verify-payment", verifyPaymentRzp);

    return router;

}