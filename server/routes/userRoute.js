import express from "express";
import {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userSignup,
    userLogin,
    verifyOtp
} from "../controller/userController.js";
import { isAuthenticated } from "../universalFunctions.js";

// API Routes
const router = express.Router();

export const userRoutes = function () {
    router.post("/auth/register", userSignup);
    router.post("/auth/verifyOtp", verifyOtp);
    router.post("/auth/login", userLogin);
    router.put("/auth/profile", isAuthenticated, updateUser);

    router.get("/list", isAuthenticated, listUsers);
    router.get("/:id", isAuthenticated, getUser);
    router.post("/add", isAuthenticated, createUser);
    router.delete("/:id", isAuthenticated, deleteUser);

    return router;

}