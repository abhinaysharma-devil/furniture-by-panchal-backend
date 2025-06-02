import { pgTable, text, serial, integer, timestamp, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  mobile: text("mobile"),
});

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imgPath: text("imgPath").notNull(),
});

// Furniture Item model
export const furnitureItems = pgTable("furniture_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("categoryId").notNull(),
  title: text("title").notNull(),
  price: doublePrecision("price").notNull(),
  description: text("description").notNull(),
  imgPath: text("imgPath").notNull(),
  featured: boolean("featured").default(false),
  inStock: boolean("inStock").default(true),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("reviewCount").default(0),
});

// Cart model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  itemId: integer("itemId").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  orderDetails: text("orderDetails").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Static content models
export const aboutUs = pgTable("about_us", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
});

export const contactUs = pgTable("contact_us", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  hours: text("hours").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertFurnitureItemSchema = createInsertSchema(furnitureItems).omit({ id: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
