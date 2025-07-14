import express from "express";
import { categoryDetailsBySlug, categoryList } from "../controller/categoryController.js";

// API Routes
const router = express.Router();

export const categoryRoute = function () {

    router.get("/list", categoryList);

    router.get("/items", categoryDetailsBySlug);

    return router;

}