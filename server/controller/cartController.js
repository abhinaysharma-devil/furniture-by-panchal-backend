import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function addItemInCart(req, res) {
    try {
        const itemId = req.body.itemId
        const quantity = req.body.quantity
        const userId = req.userId;

        const getItemById = await universalDao.getItemById({ id: itemId })

        if (getItemById.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        } else {

            // Check if item is already in cart
            const getCartDetailByItemId = await universalDao.getCartDetailByItemId({
                userId,
                itemId
            })

            if (getCartDetailByItemId && getCartDetailByItemId.length != 0) {
                await universalDao.updateCartItemDetail({
                    quantity: getCartDetailByItemId[0].quantity + (quantity || 1),
                    id: getCartDetailByItemId[0].id
                })
                // Add new item to cart
                return res.status(200).json({
                    message: "Item updated in cart successfully",
                });

            } else {
                await universalDao.insertItemInCart({
                    quantity,
                    itemId,
                    userId
                })

                // Add new item to cart
                return res.status(200).json({
                    message: "Item added to cart successfully",
                });
            }
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error });
        } else {
            console.error("Create order error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

export async function getCartDetails(req, res) {
    try {
        const userId = req.userId;

        const cartDetails = await universalDao.getCartDetailByUserId({ userId });

        if (cartDetails.length === 0) {
            return res.status(204).json({ message: "Cart is empty" });
        }

        return res.status(200).json(cartDetails);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error });
        } else {
            console.error("Get cart details error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

export async function updateCartItem(req, res) {
    try {
        const userId = req.userId;
        const cartItemId = parseInt(req.params.id);
        const { quantity } = req.body;

        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: "Invalid cart item ID" });
        }

        // Validate quantity
        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const updatedCartItems = await universalDao.updateCartItemQuantity({
            cartItemId,
            userId,
            quantity
        });

        if (updatedCartItems.length === 0) {
            return res.status(404).json({ message: "Cart item not found or you don't have permission to update it" });
        }

        return res.status(200).json(updatedCartItems[0]);
    } catch (error) {
        console.error("Update cart item error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

export async function removeCartItem(req, res) {
    try {
        const userId = req.userId;
        const cartItemId = parseInt(req.params.id);

        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: "Invalid cart item ID" });
        }

        const deletedItems = await universalDao.deleteCartItem({ cartItemId, userId });

        if (deletedItems.length === 0) {
            return res.status(404).json({ message: "Cart item not found or you don't have permission to delete it" });
        }

        return res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        console.error("Remove cart item error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function clearUserCart(req, res) {
    try {
        const userId = req.userId;
        await universalDao.clearCart({ userId });
        return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
