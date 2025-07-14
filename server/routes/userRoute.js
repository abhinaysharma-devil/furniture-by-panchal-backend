import express from "express";
import {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userSignup,
    userLogin
} from "../controller/userController.js";
import { isAuthenticated } from "../universalFunctions.js";

// API Routes
const router = express.Router();

export const userRoutes = function () {
    router.post("/auth/register", userSignup);
    router.post("/auth/login", userLogin);


    router.get("/list", isAuthenticated, listUsers);
    router.get("/:id", isAuthenticated, getUser);
    router.post("/add", isAuthenticated, createUser);
    router.put("/:id", isAuthenticated, updateUser);
    router.delete("/:id", isAuthenticated, deleteUser);

    return router;

}