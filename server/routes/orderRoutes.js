import express from "express";
import { changeOrderStatus, addOrders } from "../controller/orderController.js";
import { isAuthenticated } from "../universalFunctions.js";

// API Routes
const router = express.Router();

export const orderRoutes = function () {

    router.put("/orders/changeStatus", isAuthenticated, changeOrderStatus);

    router.post("/orders/add", isAuthenticated, addOrders);

    return router;

}