import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function itemBySlug(req, res) {
    try {

        const slug = req.query.slug

        const itemBySlug = await universalDao.getItemBySlug({ slug })

        if (itemBySlug.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        } else {
            res.status(200).json(...itemBySlug);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Create order error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
