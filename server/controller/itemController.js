import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function itemBySlug(req, res) {
    try {

        const slug = req.query.slug

        const itemBySlug = await universalDao.getItemBySlug({ slug })

        if (itemBySlug.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        } else {
            res.status(200).json(itemBySlug[0]); // Changed to return the first item, as it's a single item by slug
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Get item by slug error:", error); // More specific error message
            res.status(500).json({ message: error.message });
        }
    }
}

export async function featuredItems(req, res) {
    try {

        const slug = req.query.slug

        const itemBySlug = await universalDao.featuredItems()

        if (itemBySlug.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        } else {
            res.status(200).json(itemBySlug); // Changed to return the first item, as it's a single item by slug
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Get item by slug error:", error); // More specific error message
            res.status(500).json({ message: error.message });
        }
    }
}

