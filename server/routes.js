import express from "express";
import { createServer } from "http";
import session from "express-session";
import memorystore from "memorystore";

// Import the consolidated isAuthenticated middleware
// import { isAuthenticated } from "../universalFunctions.js";

// The original storage.js is commented out, so I'll assume it's not used.
// If MemStorage is still needed for some reason, it would need to be re-evaluated.
// import { storage } from "./storage.js";

// Session types
// TypeScript specific session declaration removed.
// If you need to augment SessionData in JS, it's usually done via assignment
// e.g. req.session.userId = 123;
// Type checking for this would rely on JSDoc or be implicit.

export async function registerRoutes(app) {
  // Create HTTP server
  const httpServer = createServer(app);

  // Configure session
  const MemoryStore = memorystore(session);

  app.use(session({
    secret: process.env.SESSION_SECRET || "furniture-by-panchal-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({ checkPeriod: 86400000 }) // prune expired entries every 24h
  }));

  // API Routes
  const apiRouter = express.Router();

  // *********************************** Auth routes ************************************
  apiRouter.get("/test", async (req, res) => {
    try {
      res.json("test");
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });
  // Register API routes
  // The main index.js already registers these routes directly.
  // app.use("/api", apiRouter);

  return httpServer;
}
