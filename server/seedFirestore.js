// s:/personal_projects/furniture_backend/server/seedFirestore.js

import bcrypt from 'bcryptjs';
import randomInteger from 'random-int';
import { db } from './config/firebase.js'; // Import the correctly initialized admin db instance

import { collection, getDocs, doc, setDoc, addDoc } from "firebase/firestore";

async function seedFirestore() {
    console.log("Starting Firestore seeding...");

    // --- Optional: Clear existing data (use with caution!) ---
    // Uncomment the lines below if you want to clear collections before seeding.
    // await clearCollection("users");
    // await clearCollection("categories");
    // await clearCollection("furnitureItems");
    // await clearCollection("cartItems"); // Cart items are usually transient
    // await clearCollection("orders");
    // await clearCollection("subsEmail");
    // await clearCollection("settings");
    // ---------------------------------------------------------

    // Seed Categories
    const categories = [
        { title: "Living Room", description: "Sofas, coffee tables, TV units, and more", imgPath: "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "living-room" },
        { title: "Bedroom", description: "Beds, wardrobes, dressers, and nightstands", imgPath: "https://images.unsplash.com/photo-1618773928121-c32242e83f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "bedroom" },
        { title: "Dining Room", description: "Dining tables, chairs, sideboards, and cabinets", imgPath: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "dining-room" },
        { title: "Home Office", description: "Desks, office chairs, bookcases, and storage", imgPath: "https://images.unsplash.com/photo-1593476550610-87baa860004a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "home-office" },
        { title: "Outdoor", description: "Patio sets, outdoor sofas, dining sets, and decor", imgPath: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "outdoor" },
        { title: "Decor & Accessories", description: "Lamps, rugs, mirrors, wall art, and more", imgPath: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500", slug: "decor-accessories" },
    ];
    await Promise.all(categories.map(cat => addDoc(collection(db, "categories"), cat)))

    // await Promise.all(categories.map(cat => db.collection("categories").doc(String(cat.id)).set(cat)));
    console.log("Categories seeded.");

    // Seed Furniture Items
    const furnitureItems = [
        { id: 1, categoryId: "7EbTuovPLI0kj1WMpvEw", title: "Modern Gray Sofa", price: 849.99, description: "A comfortable modern sofa with high-quality upholstery and solid wood legs.", imgPath: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600", featured: true, inStock: true, rating: 4.5, reviewCount: 24, slug: "modern-gray-sofa", isDeleted: false },
        { id: 2, categoryId: "7EbTuovPLI0kj1WMpvEw", title: "Wooden Dining Set", price: 1299.99, description: "A beautiful dining set with a solid wood table and six matching chairs.", imgPath: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600", featured: true, inStock: true, rating: 5.0, reviewCount: 18, slug: "wooden-dining-set", isDeleted: false },
        { id: 3, categoryId: "7EbTuovPLI0kj1WMpvEw", title: "King Size Bed Frame", price: 999.99, description: "A sturdy king-size bed frame with a modern design and wooden finish.", imgPath: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600", featured: true, inStock: true, rating: 4.0, reviewCount: 12, slug: "king-size-bed-frame", isDeleted: false },
        { id: 4, categoryId: "7EbTuovPLI0kj1WMpvEw", title: "Office Desk Set", price: 749.99, description: "A complete office solution with desk, chair, and storage options.", imgPath: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600", featured: true, inStock: true, rating: 3.5, reviewCount: 9, slug: "office-desk-set", isDeleted: false },
        { id: 5, categoryId: '7EbTuovPLI0kj1WMpvEw', title: "Complete Living Room Set", price: 1899.99, description: "Includes sofa, coffee table, and two accent chairs in matching style.", imgPath: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400", featured: true, inStock: true, rating: 4.7, reviewCount: 31, slug: "complete-living-room-set", isDeleted: false },
        { id: 6, categoryId: "7EbTuovPLI0kj1WMpvEw", title: "Queen Bedroom Collection", price: 2099.99, description: "Complete set with queen bed, two nightstands, and matching dresser.", imgPath: "https://images.unsplash.com/photo-1629079447777-1e605162dc8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400", featured: true, inStock: true, rating: 4.8, reviewCount: 22, slug: "queen-bedroom-collection", isDeleted: false },
    ];
    await Promise.all(furnitureItems.map(item => addDoc(collection(db, "furnitureItems"), item)));
    console.log("Furniture Items seeded.");

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt); // Example password

    const users = [
        { name: "John Doe", email: "john.doe@example.com", mobile: "1234567890", password: hashedPassword, otp: randomInteger(1000, 9999), is_otp_verified: 1, createdAt: new Date().toISOString() },
        { name: "Jane Smith", email: "jane.smith@example.com", mobile: "0987654321", password: hashedPassword, otp: randomInteger(1000, 9999), is_otp_verified: 0, createdAt: new Date().toISOString() },
    ];
    await Promise.all(users.map(user => addDoc(collection(db, "users"), user)));
    console.log("Users seeded.");

    // Seed Settings (example)
    const settingsDocId = "app_settings";
    const appSettings = {
        setting: JSON.stringify({
            currency: "INR",
            taxRate: 0.18,
            shippingCost: 50,
        }),
        updatedAt: new Date().toISOString()
    };
    await addDoc(collection(db, "settings"), appSettings)
    console.log("Settings seeded.");

    console.log("Firestore seeding complete!");
}

// Function to clear a collection (use with extreme caution!)
// async function clearCollection(collectionName) {
//     const collectionRef = db.collection(collectionName);
//     const snapshot = await collectionRef.get();
//     const batch = db.batch();
//     snapshot.docs.forEach((doc) => {
//         batch.delete(doc.ref);
//     });
//     await batch.commit();
//     console.log(`Collection '${collectionName}' cleared.`);
// }

seedFirestore().catch(console.error);
