import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"

import { sendMail } from "../../services/smtpServices.js";
import { orderTemplateForAdmin } from "../templates/mailTemplates.js"; // Assuming otpTemplate is used here, though it's commented out in the original.


export async function changeOrderStatus(req, res) {
    try {

        const { orderId, status } = req.body;

        const getOrderById = await universalDao.getOrderById({ orderId })

        if (getOrderById.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        await universalDao.updateOrderStatusById({ orderId, status });

        // Return the updated order, assuming updateOrderStatusById returns the updated record
        const updatedOrder = await universalDao.getOrderById({ orderId });
        res.status(200).json(updatedOrder[0]); // Changed from 201 to 200 for update
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

        // Get cart items
        const cartItems = await universalDao.getCartDetailByUserId({ userId });


        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        // Get item details for each cart item
        const itemIds = cartItems.map(ci => ci.itemId);
        const furniturePieces = await universalDao.getFurniturePieces(itemIds);


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

        const orderData = { // insertOrderSchema.parse(req.body); // Removed Drizzle schema validation
            userId,
            orderDetails,
            status: "pending",
            createdAt: new Date().toISOString() // Add createdAt for Firestore
        };

        let newOrderData = await universalDao.addOrder(orderData)

        await universalDao.clearCart({ userId })

        sendMail({
            to: "panchalabhinay@gmail.com",
            subject: "Order Alert - Furniture By Panchal",
            html: orderTemplateForAdmin(newOrderData[0])
        });

        res.status(201).json(newOrderData[0]);

    } catch (error) {
        console.log('Error creating order:', error.message);
        if (error instanceof z.ZodError) { // More specific error message
            res.status(400).json({ message: "Invalid order data", errors: error.errors });
        } else {
            console.error("Create order error stack:", error.stack);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function getOrderListByUserId(req, res) {
    try {

        const userId = req.userId;
        const getOrderListByUserId = await universalDao.getOrderListByUserId({ userId })

        res.status(201).json(getOrderListByUserId);

    } catch (error) {
        console.log('Error creating order:', error.message);
        if (error instanceof z.ZodError) { // More specific error message
            res.status(400).json({ message: "Invalid order data", errors: error.errors });
        } else {
            console.error("Create order error stack:", error.stack);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function getOrderDetailById(req, res) {
    try {

        const getOrderListByUserId = await universalDao.getOrderById({ orderId: req.params.id })

        res.status(201).json(getOrderListByUserId[0]);

    } catch (error) {
        console.log('Error creating order:', error.message);
        if (error instanceof z.ZodError) { // More specific error message
            res.status(400).json({ message: "Invalid order data", errors: error.errors });
        } else {
            console.error("Create order error stack:", error.stack);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}