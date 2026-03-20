import express from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, log } from "./vite.js";
import { db } from "./config/firebase.js"; // Import the db instance
import cors from "cors";
import { orderRoutes } from "./routes/orderRoutes.js";
import { itemsRoute } from "./routes/itemsRoute.js";
import { categoryRoute } from "./routes/categoryRoute.js";
import { cartRoute } from "./routes/cartRoute.js";
import { userRoutes } from "./routes/userRoute.js";
import { otherStuff } from "./routes/otherStuffRoute.js";
import { paymentRoutes } from "./routes/paymentRoute.js";

// Create Express app

const app = express();

// CORS configuration
// const corsOptions = {
//   origin: 'http://localhost:5173', // Allow requests from your frontend
//   optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true, // Allow cookies to be sent with requests
// };
app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make the db instance available to routes
app.locals.db = db;

app.use("/api", orderRoutes())
app.use("/api/item", itemsRoute())
app.use("/api/category", categoryRoute())
app.use("/api/cart", cartRoute())
app.use("/api/user", userRoutes())
app.use("/api/stuff", otherStuff())
app.use("/rzp", paymentRoutes())

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} innnn ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    } else if (path === "/") {
      log(`${req.method} === ${path} ${res.statusCode} in ${duration}ms`);
      // res.status(200).send("welcome to the API");
    }
  });

  next();
});

//add global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!');
});


console.log("App starting...");

(async () => {
  console.log("Before registerRoutes");

  const server = await registerRoutes(app);

  console.log("After registerRoutes");

  console.log("Before Vite");

  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  }

  console.log("Before listen");

  const port = process.env.PORT || 8080;

  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    console.log(`Server running on ${port}`);
  });
})();