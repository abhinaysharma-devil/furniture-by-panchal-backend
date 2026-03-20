import express from "express";
import { addItemInCart, getCartDetails, updateCartItem, removeCartItem, clearUserCart } from "../controller/cartController.js";
import { isAuthenticated } from "../universalFunctions.js";

// API Routes
const router = express.Router();

export const cartRoute = function () {
    router.post("/add", isAuthenticated, addItemInCart);
    router.get("/get", isAuthenticated, getCartDetails);
    router.put("/update", isAuthenticated, updateCartItem);
    router.delete("/clear/:id", isAuthenticated, removeCartItem);
    router.delete("/clear", isAuthenticated, clearUserCart);

    return router;

}