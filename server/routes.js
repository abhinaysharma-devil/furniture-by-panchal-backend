import express from "express";
import { createServer } from "http";
import { storage } from "./storage.js";
// import { storage } from "./storage"; // We'll replace usage of this
import {
  insertUserSchema,
  loginSchema,
  insertCartItemSchema,
  insertOrderSchema
} from "../shared/schema.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import session from "express-session";
import memorystore from "memorystore";
import fetch from 'node-fetch'; // Or your preferred HTTP client for Node.js
import { eq, and, desc, inArray } from 'drizzle-orm';

import * as schema from "../shared/schema.js";

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

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // API Routes
  const apiRouter = express.Router();

  // *********************************** Auth routes ************************************
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUsers = await db.select().from(schema.users).where(eq(schema.users.email, userData.email)).limit(1);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user with hashed password
      const newUsers = await db.insert(schema.users).values({
        ...userData,
        password: hashedPassword
      }).returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email, mobile: schema.users.mobile });

      if (newUsers.length === 0) {
        return res.status(500).json({ message: "Failed to create user" });
      }
      res.status(201).json(newUsers[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });


  apiRouter.get("/test", async (req, res) => {
    try {
      res.json("test");
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const { email, password } = loginSchema.parse(req.body);

      // Find user by email
      const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
      if (users.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const user = users[0];

      // // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password :", password)
      console.log("user.password:", user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare passwords
      // const isMatch = await bcrypt.compare(password, user.password);
      // console.log("Password :", password)
      // console.log("user.password:", user.password)
      // if (password != user.password) {
      //   return res.status(400).json({ message: "Invalid credentials" });
      // }

      // Set session
      req.session.userId = user.id;
      req.session.isAuthenticated = true;
      req.session.user = { id: user.id, name: user.name, email: user.email }; // Store some user info

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.log("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  apiRouter.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // *********************************** Category routes ***************************************
  apiRouter.get("/categories", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const categories = await db.select().from(schema.categories);
      // const categories = await storage.getCategories();

      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/categories/:id", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid category ID" });

      const categories = await db.select().from(schema.categories).where(eq(schema.categories.id, id)).limit(1);

      if (categories.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(categories[0]);
    } catch (error) {
      console.error("Get category by ID error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Furniture Item routes
  apiRouter.get("/furniture-items", async (_req, res) => {
    try {
      const db = _req.app.locals.db;
      const items = await db.select().from(schema.furnitureItems);
      res.json(items);
    } catch (error) {
      console.error("Get furniture items error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/furniture-items/featured", async (_req, res) => {
    try {
      const db = _req.app.locals.db;
      const items = await db.select().from(schema.furnitureItems).where(eq(schema.furnitureItems.featured, true));

      res.json(items);
    } catch (error) {
      // console.error("Get featured furniture items error:", error);
      // res.status(500).json({ message: "Internal server error" });
      const items = await storage.getFurnitureItems();
      res.json(items);
    }
  });

  apiRouter.get("/furniture-items/:id", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid item ID" });

      const items = await db.select().from(schema.furnitureItems).where(eq(schema.furnitureItems.id, id)).limit(1);
      if (items.length === 0) {
        return res.status(404).json({ message: "Furniture item not found" });
      }
      res.json(items[0]);
    } catch (error) {
      console.error("Get furniture item by ID error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/categories/:id/furniture-items", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) return res.status(400).json({ message: "Invalid category ID" });

      const db = req.app.locals.db;
      const items = await db.select().from(schema.furnitureItems).where(eq(schema.furnitureItems.categoryId, categoryId));
      res.json(items);
    } catch (error) {
      console.error("Get furniture items by category ID error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cart routes
  apiRouter.get("/cart", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      // const userId = req.session.userId;
      const userId = req.session.userId;

      const cartWithDetails = await db
        .select({
          id: schema.cartItems.id,
          userId: schema.cartItems.userId,
          itemId: schema.cartItems.itemId,
          quantity: schema.cartItems.quantity,
          item: { // Nest furniture item details under 'item' key
            id: schema.furnitureItems.id,
            title: schema.furnitureItems.title,
            price: schema.furnitureItems.price,
            description: schema.furnitureItems.description,
            imgPath: schema.furnitureItems.imgPath,
            featured: schema.furnitureItems.featured,
            inStock: schema.furnitureItems.inStock,
            rating: schema.furnitureItems.rating,
            reviewCount: schema.furnitureItems.reviewCount,
            categoryId: schema.furnitureItems.categoryId,
          },
        })
        .from(schema.cartItems)
        .leftJoin(schema.furnitureItems, eq(schema.cartItems.itemId, schema.furnitureItems.id))
        .where(eq(schema.cartItems.userId, userId));

      res.json(cartWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/cart", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });

      // Check if item exists
      const items = await db.select().from(schema.furnitureItems).where(eq(schema.furnitureItems.id, cartItemData.itemId)).limit(1);
      if (items.length === 0) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      // Check if item is already in cart
      const existingCartItems = await db.select().from(schema.cartItems)
        .where(and(eq(schema.cartItems.userId, userId), eq(schema.cartItems.itemId, cartItemData.itemId)))
        .limit(1);

      if (existingCartItems.length > 0) {
        const existingCartItem = existingCartItems[0];
        // Update quantity
        const updatedCartItems = await db.update(schema.cartItems).set({
          quantity: existingCartItem.quantity + (cartItemData.quantity || 1)
        }).where(eq(schema.cartItems.id, existingCartItem.id)).returning();
        return res.json(updatedCartItems[0]);
      }

      // Add new item to cart
      const newCartItems = await db.insert(schema.cartItems).values(cartItemData).returning();
      res.status(201).json(newCartItems[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  apiRouter.put("/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;
      const cartItemId = parseInt(req.params.id);
      const { quantity } = req.body;

      // Validate quantity
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      // Check if cart item exists and belongs to user
      const cartItems = await db.select().from(schema.cartItems)
        .where(and(eq(schema.cartItems.id, cartItemId), eq(schema.cartItems.userId, userId)))
        .limit(1);

      if (cartItems.length === 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Update cart item
      const updatedCartItems = await db.update(schema.cartItems).set({ quantity })
        .where(eq(schema.cartItems.id, cartItemId)).returning();
      res.json(updatedCartItems[0]);
    } catch (error) {
      console.error("Update cart item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.delete("/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const db = req.app.locals.db;
      const cartItemId = parseInt(req.params.id);
      if (isNaN(cartItemId)) return res.status(400).json({ message: "Invalid cart item ID" });

      // Check if cart item exists and belongs to user
      const cartItems = await db.delete(schema.cartItems)
        .where(and(eq(schema.cartItems.id, cartItemId), eq(schema.cartItems.userId, userId)))
        .returning();

      if (cartItems.length === 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Cart item removed" });
    } catch (error) {
      console.error("Delete cart item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.delete("/cart", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;

      // Clear user's cart
      await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, userId));
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order routes
  apiRouter.get("/orders", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;
      const orders = await db.select().from(schema.orders)
        .where(eq(schema.orders.userId, userId))
        .orderBy(desc(schema.orders.createdAt));
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.get("/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const db = req.app.locals.db;
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

      const orders = await db.select().from(schema.orders)
        .where(and(eq(schema.orders.id, orderId), eq(schema.orders.userId, userId)))
        .limit(1);

      if (orders.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(orders[0]);
    } catch (error) {
      console.error("Get order by ID error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.post("/orders", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;

      // Get cart items
      const cartItems = await db.select({ id: schema.cartItems.id, itemId: schema.cartItems.itemId, quantity: schema.cartItems.quantity })
        .from(schema.cartItems)
        .where(eq(schema.cartItems.userId, userId));

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Get item details for each cart item
      const itemIds = cartItems.map(ci => ci.itemId);
      const furniturePieces = await db.select({ id: schema.furnitureItems.id, title: schema.furnitureItems.title, price: schema.furnitureItems.price })
        .from(schema.furnitureItems)
        .where(inArray(schema.furnitureItems.id, itemIds));

      const itemDetailsMap = new Map();
      furniturePieces.forEach(fp => itemDetailsMap.set(fp.id, { title: fp.title, price: fp.price }));

      // Create order details
      const orderItems = cartItems.map((cartItem) => ({
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
        price: itemDetailsMap.get(cartItem.itemId)?.price || 0,
        title: itemDetailsMap.get(cartItem.itemId)?.title || "Unknown Item"
      }));

      const orderTotal = orderItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );

      // Create order with order details as JSON string
      const orderDetails = JSON.stringify({
        items: orderItems,
        total: orderTotal,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod
      });

      const orderData = insertOrderSchema.parse({
        userId,
        orderDetails,
        status: "pending"
      });

      const newOrders = await db.insert(schema.orders).values(orderData).returning();

      // Clear cart after order is created
      await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, userId));

      res.status(201).json(newOrders[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // User profile route
  apiRouter.get("/profile", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;
      const users = await db.select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        mobile: schema.users.mobile
      }).from(schema.users).where(eq(schema.users.id, userId)).limit(1);

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(users[0]);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  apiRouter.put("/profile", isAuthenticated, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.session.userId;
      const { name, email, mobile } = req.body;

      // Update user data
      const updatedUser = await storage.updateUser(userId, {
        name,
        email,
        mobile
      });
      const updatedUsers = await db.update(schema.users).set({
        name,
        email,
        mobile
      }).where(eq(schema.users.id, userId))
        .returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email, mobile: schema.users.mobile });

      if (updatedUsers.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update session user info if needed
      req.session.user = { ...req.session.user, name: updatedUsers[0].name, email: updatedUsers[0].email };
      res.json(updatedUsers[0]);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register API routes
  app.use("/api", apiRouter);

  return httpServer;
}
