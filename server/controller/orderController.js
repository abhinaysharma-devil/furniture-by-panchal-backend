import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function changeOrderStatus(req, res) {
    try {

        // const userId = req.userId;
        // const orderId = parseInt(req.params.id);

        const { orderId, status } = req.body;

        const getOrderById = await universalDao.getOrderById({ orderId })

        if (getOrderById.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        await universalDao.updateOrderStatusById({ orderId, status })

        res.status(201).json(getOrderById);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Create order error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function addOrders(req, res) {
    try {

        const userId = req.userId;
        // const orderId = parseInt(req.params.id);

        const { orderId, status } = req.body;

        // Get cart items
        const cartItems = await universalDao.getCartDetailByUserId({ userId })

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


        if (getOrderById.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        await universalDao.updateOrderStatusById({ orderId, status })

        res.status(201).json(getOrderById);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Create order error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}