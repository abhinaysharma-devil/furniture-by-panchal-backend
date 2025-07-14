import { db } from "../../drizzle/db.js";
import * as schema from "../../shared/schema.js";
import { eq, and, desc, inArray } from 'drizzle-orm';

const universalDao = {

    // Order Methods
    async getOrderById(payload) {
        return db.select()
            .from(schema.orders)
            .where(eq(schema.orders.id, payload.orderId));
    },

    async updateOrderStatusById(payload) {
        return db.update(schema.orders)
            .set({ status: payload.status })
            .where(eq(schema.orders.id, payload.orderId))
            .returning();
    },

    // Category Methods
    async categoryIdBySlug(payload) {
        return db.select({ id: schema.categories.id })
            .from(schema.categories)
            .where(eq(schema.categories.slug, payload.slug));
    },

    async getCategoryList() {
        return db.select().from(schema.categories);
    },

    // Item Methods
    async getItemBySlug(payload) {
        return db.select()
            .from(schema.furnitureItems)
            .where(eq(schema.furnitureItems.slug, payload.slug));
    },

    async getItemById(payload) {
        return db.select()
            .from(schema.furnitureItems)
            .where(eq(schema.furnitureItems.id, payload.id));
    },

    async itemListByCatId(payload) {
        return db.select()
            .from(schema.furnitureItems)
            .where(eq(schema.furnitureItems.categoryId, payload.categoryId));
    },

    // Cart Methods
    async getCartDetailByItemId(payload) {
        return db.select().from(schema.cartItems)
            .where(and(eq(schema.cartItems.userId, payload.userId), eq(schema.cartItems.itemId, payload.itemId)))
            .limit(1);
    },

    async updateCartItemDetail(payload) {
        return db.update(schema.cartItems).set({
            quantity: payload.quantity
        }).where(eq(schema.cartItems.id, payload.id))
            .returning();
    },

    async insertItemInCart(payload) {
        return db.insert(schema.cartItems).values(payload).returning();
    },

    async getCartDetailByUserId(payload) {
        return db
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
                    slug: schema.furnitureItems.slug,
                },
            })
            .from(schema.cartItems)
            .leftJoin(schema.furnitureItems, eq(schema.cartItems.itemId, schema.furnitureItems.id))
            .where(eq(schema.cartItems.userId, payload.userId));
    },

    async updateCartItemQuantity(payload) {
        return db.update(schema.cartItems)
            .set({ quantity: payload.quantity })
            .where(and(eq(schema.cartItems.id, payload.cartItemId), eq(schema.cartItems.userId, payload.userId)))
            .returning();
    },

    async deleteCartItem(payload) {
        return db.delete(schema.cartItems)
            .where(and(eq(schema.cartItems.id, payload.cartItemId), eq(schema.cartItems.userId, payload.userId)))
            .returning();
    },

    async clearCart(payload) {
        return db.delete(schema.cartItems).where(eq(schema.cartItems.userId, payload.userId)).returning();
    },

    // User Methods
    async getUsers() {
        // Exclude password from the result
        return db.select({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            mobile: schema.users.mobile
        }).from(schema.users);
    },

    async getUserById(payload) {
        return db.select({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            mobile: schema.users.mobile
        }).from(schema.users).where(eq(schema.users.id, payload.id)).limit(1);
    },

    async getUserByEmail(payload) {
        return db.select()
            .from(schema.users)
            .where(eq(schema.users.email, payload.email))
            .limit(1);
    },

    async createUser(payload) {
        return db.insert(schema.users).values(payload).returning({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            mobile: schema.users.mobile,
            otp: schema.users.otp
        });
    },

    async updateUserById(payload) {
        const { userId, ...updateData } = payload;
        return db.update(schema.users)
            .set(updateData)
            .where(eq(schema.users.id, userId))
            .returning({
                id: schema.users.id,
                name: schema.users.name,
                email: schema.users.email,
                mobile: schema.users.mobile
            });
    },

    async deleteUserById(payload) {
        return db.delete(schema.users).where(eq(schema.users.id, payload.userId)).returning({ id: schema.users.id });
    },

    async addSubsEmail(payload) {
        return db.insert(schema.subsEmail).values(payload).returning();
    },

    async updateOtpStatus(payload) {
        return db.update(schema.users)
            .set({ is_otp_verified: 1 })
            .where(eq(schema.users.id, payload.userId))
            .returning();
    },

}

export { universalDao }