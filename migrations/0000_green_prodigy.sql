CREATE TABLE "about_us" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"itemId" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"imgPath" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_us" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"hours" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "furniture_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" integer NOT NULL,
	"title" text NOT NULL,
	"price" double precision NOT NULL,
	"description" text NOT NULL,
	"imgPath" text NOT NULL,
	"featured" boolean DEFAULT false,
	"inStock" boolean DEFAULT true,
	"rating" double precision DEFAULT 0,
	"reviewCount" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"orderDetails" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"mobile" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
