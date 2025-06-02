// import { 
//   User, InsertUser, Category, InsertCategory, 
//   FurnitureItem, InsertFurnitureItem, CartItem, 
//   InsertCartItem, Order, InsertOrder 
// } from "@shared/schema";

// export interface IStorage {
//   // User operations
//   getUser(id: number): Promise<User | undefined>;
//   getUserByEmail(email: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;
//   updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
//   // Category operations
//   getCategories(): Promise<Category[]>;
//   getCategory(id: number): Promise<Category | undefined>;
//   createCategory(category: InsertCategory): Promise<Category>;
//   updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined>;
//   deleteCategory(id: number): Promise<boolean>;
  
//   // Furniture Item operations
//   getFurnitureItems(): Promise<FurnitureItem[]>;
//   getFurnitureItem(id: number): Promise<FurnitureItem | undefined>;
//   getFurnitureItemsByCategory(categoryId: number): Promise<FurnitureItem[]>;
//   getFeaturedFurnitureItems(): Promise<FurnitureItem[]>;
//   createFurnitureItem(item: InsertFurnitureItem): Promise<FurnitureItem>;
//   updateFurnitureItem(id: number, data: Partial<InsertFurnitureItem>): Promise<FurnitureItem | undefined>;
//   deleteFurnitureItem(id: number): Promise<boolean>;
  
//   // Cart operations
//   getCartItems(userId: number): Promise<CartItem[]>;
//   getCartItem(id: number): Promise<CartItem | undefined>;
//   getCartItemByUserAndItem(userId: number, itemId: number): Promise<CartItem | undefined>;
//   createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
//   updateCartItem(id: number, data: Partial<InsertCartItem>): Promise<CartItem | undefined>;
//   deleteCartItem(id: number): Promise<boolean>;
//   clearCart(userId: number): Promise<boolean>;
  
//   // Order operations
//   getOrders(userId: number): Promise<Order[]>;
//   getOrder(id: number): Promise<Order | undefined>;
//   createOrder(order: InsertOrder): Promise<Order>;
//   updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
// }

// export class MemStorage implements IStorage {
//   private users: Map<number, User>;
//   private categories: Map<number, Category>;
//   private furnitureItems: Map<number, FurnitureItem>;
//   private cartItems: Map<number, CartItem>;
//   private orders: Map<number, Order>;
  
//   private userCurrentId: number;
//   private categoryCurrentId: number;
//   private furnitureItemCurrentId: number;
//   private cartItemCurrentId: number;
//   private orderCurrentId: number;
  
//   constructor() {
//     // Initialize maps
//     this.users = new Map();
//     this.categories = new Map();
//     this.furnitureItems = new Map();
//     this.cartItems = new Map();
//     this.orders = new Map();
    
//     // Initialize IDs
//     this.userCurrentId = 1;
//     this.categoryCurrentId = 1;
//     this.furnitureItemCurrentId = 1;
//     this.cartItemCurrentId = 1;
//     this.orderCurrentId = 1;
    
//     // Add seed data
//     this.seedData();
//   }
  
//   private seedData() {
//     // Add sample categories
//     const livingRoom = this.createCategory({
//       title: "Living Roomxx",
//       description: "Sofas, coffee tables, TV units, and more",
//       imgPath: "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     const bedroom = this.createCategory({
//       title: "Bedroom",
//       description: "Beds, wardrobes, dressers, and nightstands",
//       imgPath: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     const diningRoom = this.createCategory({
//       title: "Dining Room",
//       description: "Dining tables, chairs, sideboards, and cabinets",
//       imgPath: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     const homeOffice = this.createCategory({
//       title: "Home Office",
//       description: "Desks, office chairs, bookcases, and storage",
//       imgPath: "https://images.unsplash.com/photo-1593476550610-87baa860004a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     const outdoor = this.createCategory({
//       title: "Outdoor",
//       description: "Patio sets, outdoor sofas, dining sets, and decor",
//       imgPath: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     const decor = this.createCategory({
//       title: "Decor & Accessories",
//       description: "Lamps, rugs, mirrors, wall art, and more",
//       imgPath: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
//     });
    
//     // Add sample furniture items
//     this.createFurnitureItem({
//       categoryId: livingRoom.id,
//       title: "Modern Gray Sofa",
//       price: 849.99,
//       description: "A comfortable modern sofa with high-quality upholstery and solid wood legs.",
//       imgPath: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
//       featured: true,
//       inStock: true,
//       rating: 4.5,
//       reviewCount: 24
//     });
    
//     this.createFurnitureItem({
//       categoryId: diningRoom.id,
//       title: "Wooden Dining Set",
//       price: 1299.99,
//       description: "A beautiful dining set with a solid wood table and six matching chairs.",
//       imgPath: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
//       featured: true,
//       inStock: true,
//       rating: 5.0,
//       reviewCount: 18
//     });
    
//     this.createFurnitureItem({
//       categoryId: bedroom.id,
//       title: "King Size Bed Frame",
//       price: 999.99,
//       description: "A sturdy king-size bed frame with a modern design and wooden finish.",
//       imgPath: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
//       featured: true,
//       inStock: true,
//       rating: 4.0,
//       reviewCount: 12
//     });
    
//     this.createFurnitureItem({
//       categoryId: homeOffice.id,
//       title: "Office Desk Set",
//       price: 749.99,
//       description: "A complete office solution with desk, chair, and storage options.",
//       imgPath: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
//       featured: true,
//       inStock: true,
//       rating: 3.5,
//       reviewCount: 9
//     });
    
//     this.createFurnitureItem({
//       categoryId: livingRoom.id,
//       title: "Complete Living Room Set",
//       price: 1899.99,
//       description: "Includes sofa, coffee table, and two accent chairs in matching style.",
//       imgPath: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
//       featured: true,
//       inStock: true,
//       rating: 4.7,
//       reviewCount: 31
//     });
    
//     this.createFurnitureItem({
//       categoryId: bedroom.id,
//       title: "Queen Bedroom Collection",
//       price: 2099.99,
//       description: "Complete set with queen bed, two nightstands, and matching dresser.",
//       imgPath: "https://images.unsplash.com/photo-1629079447777-1e605162dc8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
//       featured: true,
//       inStock: true,
//       rating: 4.8,
//       reviewCount: 22
//     });
//   }
  
//   // User methods
//   async getUser(id: number): Promise<User | undefined> {
//     return this.users.get(id);
//   }
  
//   async getUserByEmail(email: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(user => user.email === email);
//   }
  
//   async createUser(user: InsertUser): Promise<User> {
//     const id = this.userCurrentId++;
//     const newUser: User = { ...user, id };
//     this.users.set(id, newUser);
//     return newUser;
//   }
  
//   async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
//     const user = this.users.get(id);
//     if (!user) return undefined;
    
//     const updatedUser: User = { ...user, ...data };
//     this.users.set(id, updatedUser);
//     return updatedUser;
//   }
  
//   // Category methods
//   async getCategories(): Promise<Category[]> {
//     return Array.from(this.categories.values());
//   }
  
//   async getCategory(id: number): Promise<Category | undefined> {
//     return this.categories.get(id);
//   }
  
//   async createCategory(category: InsertCategory): Promise<Category> {
//     const id = this.categoryCurrentId++;
//     const newCategory: Category = { ...category, id };
//     this.categories.set(id, newCategory);
//     return newCategory;
//   }
  
//   async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
//     const category = this.categories.get(id);
//     if (!category) return undefined;
    
//     const updatedCategory: Category = { ...category, ...data };
//     this.categories.set(id, updatedCategory);
//     return updatedCategory;
//   }
  
//   async deleteCategory(id: number): Promise<boolean> {
//     return this.categories.delete(id);
//   }
  
//   // Furniture Item methods
//   async getFurnitureItems(): Promise<FurnitureItem[]> {
//     return Array.from(this.furnitureItems.values());
//   }
  
//   async getFurnitureItem(id: number): Promise<FurnitureItem | undefined> {
//     return this.furnitureItems.get(id);
//   }
  
//   async getFurnitureItemsByCategory(categoryId: number): Promise<FurnitureItem[]> {
//     return Array.from(this.furnitureItems.values()).filter(
//       item => item.categoryId === categoryId
//     );
//   }
  
//   async getFeaturedFurnitureItems(): Promise<FurnitureItem[]> {
//     return Array.from(this.furnitureItems.values()).filter(
//       item => item.featured
//     );
//   }
  
//   async createFurnitureItem(item: InsertFurnitureItem): Promise<FurnitureItem> {
//     const id = this.furnitureItemCurrentId++;
//     const newItem: FurnitureItem = { ...item, id };
//     this.furnitureItems.set(id, newItem);
//     return newItem;
//   }
  
//   async updateFurnitureItem(id: number, data: Partial<InsertFurnitureItem>): Promise<FurnitureItem | undefined> {
//     const item = this.furnitureItems.get(id);
//     if (!item) return undefined;
    
//     const updatedItem: FurnitureItem = { ...item, ...data };
//     this.furnitureItems.set(id, updatedItem);
//     return updatedItem;
//   }
  
//   async deleteFurnitureItem(id: number): Promise<boolean> {
//     return this.furnitureItems.delete(id);
//   }
  
//   // Cart methods
//   async getCartItems(userId: number): Promise<CartItem[]> {
//     return Array.from(this.cartItems.values()).filter(
//       item => item.userId === userId
//     );
//   }
  
//   async getCartItem(id: number): Promise<CartItem | undefined> {
//     return this.cartItems.get(id);
//   }
  
//   async getCartItemByUserAndItem(userId: number, itemId: number): Promise<CartItem | undefined> {
//     return Array.from(this.cartItems.values()).find(
//       item => item.userId === userId && item.itemId === itemId
//     );
//   }
  
//   async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
//     const id = this.cartItemCurrentId++;
//     const newCartItem: CartItem = { ...cartItem, id };
//     this.cartItems.set(id, newCartItem);
//     return newCartItem;
//   }
  
//   async updateCartItem(id: number, data: Partial<InsertCartItem>): Promise<CartItem | undefined> {
//     const cartItem = this.cartItems.get(id);
//     if (!cartItem) return undefined;
    
//     const updatedCartItem: CartItem = { ...cartItem, ...data };
//     this.cartItems.set(id, updatedCartItem);
//     return updatedCartItem;
//   }
  
//   async deleteCartItem(id: number): Promise<boolean> {
//     return this.cartItems.delete(id);
//   }
  
//   async clearCart(userId: number): Promise<boolean> {
//     const cartItemsToDelete = Array.from(this.cartItems.values())
//       .filter(item => item.userId === userId);
      
//     for (const item of cartItemsToDelete) {
//       this.cartItems.delete(item.id);
//     }
    
//     return true;
//   }
  
//   // Order methods
//   async getOrders(userId: number): Promise<Order[]> {
//     return Array.from(this.orders.values())
//       .filter(order => order.userId === userId)
//       .sort((a, b) => {
//         if (a.createdAt && b.createdAt) {
//           return b.createdAt.getTime() - a.createdAt.getTime();
//         }
//         return 0;
//       });
//   }
  
//   async getOrder(id: number): Promise<Order | undefined> {
//     return this.orders.get(id);
//   }
  
//   async createOrder(order: InsertOrder): Promise<Order> {
//     const id = this.orderCurrentId++;
//     const createdAt = new Date();
//     const newOrder: Order = { ...order, id, createdAt };
//     this.orders.set(id, newOrder);
//     return newOrder;
//   }
  
//   async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
//     const order = this.orders.get(id);
//     if (!order) return undefined;
    
//     const updatedOrder: Order = { ...order, status };
//     this.orders.set(id, updatedOrder);
//     return updatedOrder;
//   }
// }

// export const storage = new MemStorage();


export class MemStorage {
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.furnitureItems = new Map();
    this.cartItems = new Map();
    this.orders = new Map();

    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.furnitureItemCurrentId = 1;
    this.cartItemCurrentId = 1;
    this.orderCurrentId = 1;

    this.seedData();
  }

  seedData() {
    // Add a sample category
    this.createCategory({ title: "Living Room" });
  }

  // User methods
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user) {
    const id = this.userCurrentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id, data) {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }

  async getCategory(id) {
    return this.categories.get(id);
  }

  async createCategory(category) {
    const id = this.categoryCurrentId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id, data) {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...data };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id) {
    return this.categories.delete(id);
  }

  // Furniture methods
  async getFurnitureItems() {
    return Array.from(this.furnitureItems.values());
  }

  async getFurnitureItem(id) {
    return this.furnitureItems.get(id);
  }

  async getFurnitureItemsByCategory(categoryId) {
    return Array.from(this.furnitureItems.values()).filter(
      item => item.categoryId === categoryId
    );
  }

  async getFeaturedFurnitureItems() {
    return Array.from(this.furnitureItems.values()).filter(item => item.featured);
  }

  async createFurnitureItem(item) {
    const id = this.furnitureItemCurrentId++;
    const newItem = { ...item, id };
    this.furnitureItems.set(id, newItem);
    return newItem;
  }

  async updateFurnitureItem(id, data) {
    const item = this.furnitureItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...data };
    this.furnitureItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteFurnitureItem(id) {
    return this.furnitureItems.delete(id);
  }

  // Cart methods
  async getCartItems(userId) {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async getCartItem(id) {
    return this.cartItems.get(id);
  }

  async getCartItemByUserAndItem(userId, itemId) {
    return Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.itemId === itemId
    );
  }

  async createCartItem(cartItem) {
    const id = this.cartItemCurrentId++;
    const newCartItem = { ...cartItem, id };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id, data) {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    const updatedCartItem = { ...cartItem, ...data };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id) {
    return this.cartItems.delete(id);
  }

  async clearCart(userId) {
    for (const [id, item] of this.cartItems) {
      if (item.userId === userId) {
        this.cartItems.delete(id);
      }
    }
  }

  // Order methods
  async getOrders(userId) {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getOrder(id) {
    return this.orders.get(id);
  }

  async createOrder(order) {
    const id = this.orderCurrentId++;
    const createdAt = new Date();
    const newOrder = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
