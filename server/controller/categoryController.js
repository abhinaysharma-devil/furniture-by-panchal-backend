import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function categoryDetailsBySlug(req, res) {
    try {

        const slug = req.query.slug

        const categoryIdBySlug = await universalDao.categoryIdBySlug({ slug })

        if (categoryIdBySlug.length === 0) {
            return res.status(404).json({ message: "Slug not found" });
        } else {
            const itemListByCatId = await universalDao.itemListByCatId({ categoryId: categoryIdBySlug[0].id })
            res.status(200).json(itemListByCatId);
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


export async function categoryList(req, res) {
    try {

        const slug = req.query.slug

        const getCategoryList = await universalDao.getCategoryList({ slug })

        if (getCategoryList.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        } else {
            res.status(200).json(getCategoryList);
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