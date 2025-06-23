import { z } from "zod";
import { orderDao } from "../dao/orderDao.js"


export async function changeOrderStatus(req, res) {
    try {

        const userId = req.userId;
        // const orderId = parseInt(req.params.id);

        const {orderId, status} = req.body;



        const getOrderById = await orderDao.getOrderById({ orderId })

        if (getOrderById.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        await orderDao.updateOrderStatusById({ orderId, status })

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