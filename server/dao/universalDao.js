import { db, extractQueryData, extractDocData } from "../config/firebase.js";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    limit,
    orderBy,
    addDoc,
    getDoc,
    writeBatch, // For batch operations like clearing cart
} from "firebase/firestore";
import { featuredItems } from "../controller/itemController.js";

const universalDao = {

    // Order Methods
    async getOrderById(payload) {
        const docRef = doc(db, "orders", payload.orderId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? [extractDocData(docSnap)] : [];
    },

    async updateOrderStatusById(payload) {
        const docRef = doc(db, "orders", payload.orderId);
        // To ensure the document exists before updating, we could get it first,
        // but for simplicity, we'll proceed with the update.
        // If the document doesn't exist, this will do nothing.
        await updateDoc(docRef, { status: payload.status });

        // Fetch the updated document to return it
        const updatedDocSnap = await getDoc(docRef);
        return updatedDocSnap.exists() ? [extractDocData(updatedDocSnap)] : [];
    },

    // Category Methods
    async categoryIdBySlug(payload) {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, where("slug", "==", payload.slug), limit(1));
        const querySnapshot = await getDocs(q);
        // Assuming the category ID is the Firestore document ID
        return extractQueryData(querySnapshot);
    },

    async getCategoryList() {
        const categoriesRef = collection(db, "categories");
        const querySnapshot = await getDocs(categoriesRef);
        return extractQueryData(querySnapshot);
    },

    // Item Methods
    async getItemBySlug(payload) {
        const furnitureItemsRef = collection(db, "furnitureItems");
        const q = query(
            furnitureItemsRef,
            where("slug", "==", payload.slug),
            where("isDeleted", "==", false),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },

    // Item Methods
    async featuredItems(payload) {
        const furnitureItemsRef = collection(db, "furnitureItems");
        const q = query(
            furnitureItemsRef,
            where("featured", "==", true),
            where("isDeleted", "==", false)
        );
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },


    async getItemById(payload) {
        const docRef = doc(db, "furnitureItems", payload.id);
        const docSnap = await getDoc(docRef);
        // Check if the item exists and is not marked as deleted
        return docSnap.exists() && !docSnap.data().isDeleted ? [extractDocData(docSnap)] : [];
    },

    async itemListByCatId(payload) {
        const furnitureItemsRef = collection(db, "furnitureItems");
        const q = query(
            furnitureItemsRef,
            where("categoryId", "==", payload.categoryId),
            where("isDeleted", "==", false)
        );
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },

    // Cart Methods
    async getCartDetailByItemId(payload) {
        const cartItemsRef = collection(db, "cartItems");
        const q = query(
            cartItemsRef,
            where("userId", "==", payload.userId),
            where("itemId", "==", payload.itemId),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },

    async updateCartItemDetail(payload) {
        const docRef = doc(db, "cartItems", payload.id);
        await updateDoc(docRef, { quantity: payload.quantity });
        // Fetch the updated document to return it
        const updatedDocSnap = await getDoc(docRef);
        return updatedDocSnap.exists() ? [extractDocData(updatedDocSnap)] : [];
    },

    async insertItemInCart(payload) {
        // For new items, addDoc generates a new document ID
        const cartItemsRef = collection(db, "cartItems");
        const newDocRef = await addDoc(cartItemsRef, payload);
        const newDocSnap = await getDoc(newDocRef); // getDoc to fetch the created document
        return newDocSnap.exists() ? [extractDocData(newDocSnap)] : [];
    },

    async getCartDetailByUserId(payload) {
        const cartItemsRef = collection(db, "cartItems");
        const q = query(cartItemsRef, where("userId", "==", payload.userId));
        const cartItemsSnapshot = await getDocs(q);
        const cartItems = extractQueryData(cartItemsSnapshot);

        if (cartItems.length === 0) {
            return [];
        }

        const itemIds = cartItems.map(ci => ci.itemId);
        // Firestore 'in' query has a limit of 30. If itemIds can exceed this,
        // this logic needs to be split into multiple queries or a different approach.
        // For simplicity, assuming itemIds <= 30 for now.
        const furnitureItemsRef = collection(db, "furnitureItems");
        const itemsQuery = query(
            furnitureItemsRef,
            where("__name__", "in", itemIds), // Query by document ID
            where("isDeleted", "==", false)
        );
        const furnitureItemsSnapshot = await getDocs(itemsQuery);
        const furnitureItemsMap = new Map();
        furnitureItemsSnapshot.docs.forEach(docSnap => {
            const item = extractDocData(docSnap);
            furnitureItemsMap.set(item.id, item); // Store by its document ID
        });

        return cartItems.map(cartItem => {
            const itemDetails = furnitureItemsMap.get(cartItem.itemId);
            return {
                id: cartItem.id,
                userId: cartItem.userId,
                itemId: cartItem.itemId,
                quantity: cartItem.quantity,
                item: itemDetails || null, // If itemDetails not found, set to null
            };
        });
    },

    async updateCartItemQuantity(payload) {
        // Note: This update is not checking for userId ownership.
        // The controller should ensure the user owns this cart item.
        const docRef = doc(db, "cartItems", payload.cartItemId);
        await updateDoc(docRef, { quantity: payload.quantity });

        // Fetch the updated document to return it
        const updatedDocSnap = await getDoc(docRef);
        return updatedDocSnap.exists() ? [extractDocData(updatedDocSnap)] : [];
    },

    async deleteCartItem(payload) {
        const cartItemsRef = collection(db, "cartItems");
        const q = query(
            cartItemsRef,
            where("__name__", "==", payload.cartItemId), // Query by document ID
            where("userId", "==", payload.userId),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return []; // No item found to delete
        }

        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(db, "cartItems", docToDelete.id));
        return [extractDocData(docToDelete)]; // Return the deleted item's data
    },

    async clearCart(payload) {
        const cartItemsRef = collection(db, "cartItems");
        const q = query(cartItemsRef, where("userId", "==", payload.userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        const batch = writeBatch(db); // Use writeBatch for multiple deletes
        querySnapshot.docs.forEach((d) => {
            batch.delete(d.ref);
        });
        await batch.commit();
        return querySnapshot.docs.map(d => extractDocData(d)); // Return deleted items
    },

    // User Methods
    async getUsers() {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        return extractQueryData(querySnapshot);
    },

    async getSettings() {
        const SETTINGS_DOC_ID = "app_settings"; // Assuming a fixed document ID for settings
        const docRef = doc(db, "settings", SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const docData = docSnap.data();
            if (docData.setting) {
                return JSON.parse(docData.setting);
            }
        }
        return null; // Or a default settings object if preferred
    },

    async getUserById(payload) {
        const docRef = doc(db, "users", payload.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const user = extractDocData(docSnap);
            const { password, ...userWithoutPassword } = user;
            return [userWithoutPassword];
        }
        return [];
    },

    async getUserByEmail(payload) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", payload.email), limit(1));
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },

    async createUser(payload) {
        const usersRef = collection(db, "users");
        const newDocRef = await addDoc(usersRef, payload);
        const newDocSnap = await getDoc(newDocRef); // getDoc to fetch the created document
        const newUser = newDocSnap.exists() ? extractDocData(newDocSnap) : null;
        if (newUser) {
            const { password, ...userWithoutPassword } = newUser;
            return [userWithoutPassword];
        }
        return [];
    },

    async updateUserById(payload) {
        const { userId, ...updateData } = payload;
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, updateData);

        const updatedDocSnap = await getDoc(docRef);
        const updatedUser = extractDocData(updatedDocSnap);
        if (updatedUser) {
            const { password, ...userWithoutPassword } = updatedUser;
            return [userWithoutPassword];
        }
        return [];
    },

    async deleteUserById(payload) {
        const usersRef = collection(db, "users");
        const docRef = doc(db, "users", payload.userId);
        // We could fetch the doc first to return its data, but for delete, it's often not needed.
        await deleteDoc(docRef);
        return [{ id: payload.userId }]; // Return the ID of the deleted user
    },

    async addSubsEmail(payload) {
        const subsEmailRef = collection(db, "subsEmail");
        const newDocRef = await addDoc(subsEmailRef, payload);
        const newDocSnap = await getDoc(newDocRef);
        return newDocSnap.exists() ? [extractDocData(newDocSnap)] : [];
    },

    async updateOtpStatus(payload) {
        const docRef = doc(db, "users", payload.userId);
        await updateDoc(docRef, { is_otp_verified: 1 });

        const updatedDocSnap = await getDoc(docRef);
        return updatedDocSnap.exists() ? [extractDocData(updatedDocSnap)] : [];
    },

    async addOrder(payload) {
        const ordersRef = collection(db, "orders");
        const newDocRef = await addDoc(ordersRef, payload);
        const newDocSnap = await getDoc(newDocRef);
        return newDocSnap.exists() ? [extractDocData(newDocSnap)] : [];
    },

    async getOrderListByUserId(payload) {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", payload.userId));
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },
    async getFurniturePieces(itemIds) {
        if (itemIds.length === 0) {
            return [];
        }
        const furnitureItemsRef = collection(db, "furnitureItems");
        // Firestore 'in' query has a limit of 30. If itemIds can exceed this,
        // this logic needs to be split into multiple queries.
        // For simplicity, assuming itemIds <= 30 for now.
        const q = query(
            furnitureItemsRef,
            where("__name__", "in", itemIds), // Query by document ID
            where("isDeleted", "==", false)
        );
        const querySnapshot = await getDocs(q);
        return extractQueryData(querySnapshot);
    },
}

export { universalDao }