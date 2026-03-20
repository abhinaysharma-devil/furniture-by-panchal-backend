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
            const existingCartItems = await universalDao.getCartDetailByItemId({
                userId,
                itemId
            })

            if (existingCartItems && existingCartItems.length !== 0) { // Changed to !== 0 for clarity
                const existingCartItem = existingCartItems[0];
                await universalDao.updateCartItemDetail({
                    quantity: existingCartItem.quantity + (quantity || 1),
                    id: existingCartItem.id // Use the Firestore document ID
                })
                // Add new item to cart
                return res.status(200).json({
                    message: "Item updated in cart successfully",
                });

            } else {
                await universalDao.insertItemInCart({
                    quantity,
                    itemId,
                    userId,
                    // id: Date.now() // Assign a temporary client-side ID for consistency with Drizzle's auto-increment, though Firestore will generate its own doc ID. This 'id' field will be stored in the document.
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
            console.error("Add item to cart error:", error); // More specific error message
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
            console.error("Get cart details error:", error); // More specific error message
            res.status(500).json({ message: error.message });
        }
    }
}

export async function updateCartItem(req, res) {
    try {
        const userId = req.userId;
        const cartItemId = req.body.id // This 'id' is the 'id' field within the document, not the Firestore doc ID.
        const { quantity } = req.body;

        if (!cartItemId) {
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
        const cartItemId = req.params.id // This 'id' is the 'id' field within the document, not the Firestore doc ID.

        if (!cartItemId) {
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
