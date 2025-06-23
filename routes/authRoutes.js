
// API Routes
import express from "express";

const apiRouter = express.Router();
import {login} from "../controllers/authController.js";

// apiRouter.post("/auth/login", login(req, res));