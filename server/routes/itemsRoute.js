import express from "express";
import { itemBySlug } from "../controller/itemController.js";
// import { isAuthenticated } from "../universalFunctions.js";

// API Routes
const router = express.Router();

export const itemsRoute = function () {

    router.get("/detailBySlug", itemBySlug);

    return router;

}