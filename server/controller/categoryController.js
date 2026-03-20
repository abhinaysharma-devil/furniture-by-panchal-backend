import { z } from "zod";
import { universalDao } from "../dao/universalDao.js"


export async function categoryDetailsBySlug(req, res) {
    try {


        const slug = req.query.slug

        const categoryIdBySlug = await universalDao.categoryIdBySlug({ slug });

        if (categoryIdBySlug.length === 0) {
            return res.status(404).json({ message: "Slug not found" });
        } else {
            // Assuming categoryIdBySlug returns an array like [{ id: "firestoreDocId" }]
            const categoryId = categoryIdBySlug[0].id;
            const itemListByCatId = await universalDao.itemListByCatId({ categoryId: categoryId });
            res.status(200).json(itemListByCatId);
        }
    } catch (error) {
        if (error instanceof z.ZodError) { // More specific error message
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Category details by slug error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}


export async function categoryList(req, res) {
    try {

        const slug = req.query.slug
        // The slug parameter is not used in the original universalDao.getCategoryList,
        // so it's effectively ignored here.
        // If filtering by slug was intended, the universalDao.getCategoryList would need modification.
        const getCategoryList = await universalDao.getCategoryList();

        if (getCategoryList.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        } else {
            res.status(200).json(getCategoryList);
        }
    } catch (error) {
        if (error instanceof z.ZodError) { // More specific error message
            res.status(400).json({ message: error.errors });
        } else {
            console.error("Category list error:", error);
            res.status(500).json({ message: error.message });
        }
    }
}