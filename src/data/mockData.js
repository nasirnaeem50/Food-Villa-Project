// src/data/mockData.js - Corrected & Updated for 2025

// ===================================================================
// == RESTAURANT INFORMATION
// ===================================================================
export const restaurants = [
  {
    id: 1,
    name: "Peshawari Spice & Global Bites",
    cuisine: ["Peshawari", "Chinese", "Italian", "Continental"],
    rating: 4.9,
    deliveryTime: "20-40 min",
    image: "/images/resturent.jpg",
    featured: true,
    deliveryFee: 200, // PKR
    minOrder: 1500, // PKR
    description: "Authentic Peshawari flavors with international favorites since 2020",
    promo: "Free dessert on orders over PKR 2500",
    openingHours: "11:00 AM - 11:00 PM",
    location: "Central Peshawar",
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  }
];

// ===================================================================
// == CATEGORIES
// ===================================================================
export const categories = [
  { id: 1, name: "Peshawari BBQ", icon: "🍖", featured: true, adminId: "admin-1" },
  { id: 2, name: "Peshawari Mains", icon: "🍛", featured: true, adminId: "admin-1" },
  { id: 3, name: "Peshawari Specials", icon: "🌟", featured: true, adminId: "admin-1" },
  { id: 4, name: "Peshawari Rice", icon: "🍚", featured: true, adminId: "admin-1" },
  { id: 5, name: "Peshawari Breads", icon: "🥖", adminId: "admin-1" },
  { id: 6, name: "Peshawari Sides", icon: "🥗", adminId: "admin-1" },
  { id: 7, name: "Peshawari Street Food", icon: "🌯", adminId: "admin-1" },
  { id: 8, name: "Peshawari Desserts", icon: "🍮", adminId: "admin-1" },
  { id: 9, name: "Chinese", icon: "🥢", adminId: "admin-1" },
  { id: 10, name: "Italian", icon: "🍝", adminId: "admin-1" },
  { id: 11, name: "Continental", icon: "🍴", adminId: "admin-1" }
];


// ===================================================================
// == INITIAL FOOD ITEMS (The source of truth for new data)
// ===================================================================
export const initialFoodItems = [
  // ========== PESHAWARI BBQ ==========
  {
    id: 101,
    name: "Premium Chapli Kebab",
    description: "2025 Special Recipe - Extra juicy beef patties with pomegranate molasses",
    price: 1800,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/kabab.jpeg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: true,
    yearSpecial: true,
    premium: true,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 104,
    name: "Namkeen Boti",
    description: "Succulent beef cubes marinated in Himalayan salt and secret spices",
    price: 1600,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/boti.jpg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 107,
    name: "Peshawari Seekh Kebab",
    description: "Minced beef kebabs with fresh herbs and spices, charcoal grilled",
    price: 1400,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/sikhkabab.jpeg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
   {
    id: 109,
    name: "Chappal Kebab",
    description: "Extra large chapli kebabs with bone marrow infusion",
    price: 2000,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/kabab.jpeg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 111,
    name: "Tikkah",
    description: "Juicy beef chunks marinated in mustard oil and spices",
    price: 1700,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/tikka.jpeg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
   {
    id: 120,
    name: "Patta Tikka",
    description: "Minced meat wrapped in caul fat and grilled to perfection. A unique BBQ item.",
    price: 1900,
    category: "Peshawari BBQ",
    restaurantId: 1,
    image: "/images/patta.jpeg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: true,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== PESHAWARI MAINS ==========
  {
    id: 102,
    name: "Peshawari Lamb Karahi",
    description: "Slow-cooked lamb in traditional copper karahi with fresh coriander",
    price: 3200,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/lamb.jpeg",
    spicyLevel: 5,
    isVegetarian: false,
    vegan: false,
    chefSpecial: true,
    bestSeller: true,
    yearSpecial: false,
    premium: false,
    serves: 3,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 106,
    name: "Dumba Karahi",
    description: "Rich mutton curry cooked in its own fat with green chilies",
    price: 3800,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/dumba.jpg",
    spicyLevel: 5,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: true,
    serves: 3,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 113,
    name: "Peshawari Dum Pukht",
    description: "Slow-cooked mutton in sealed pot with aromatic spices",
    price: 3500,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/dampoh.jpg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 3,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 114,
    name: "Peshawari Green Karahi",
    description: "Chicken cooked with fresh herbs, green chilies and coriander",
    price: 2800,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/green.jpg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 118,
    name: "Rosh",
    description: "A hearty, mildly spiced mutton stew with potatoes, a true Pashtun delicacy.",
    price: 3600,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/rosh.jpg",
    spicyLevel: 2,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 3,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 119,
    name: "Chicken Karahi",
    description: "A regional specialty, cooked with tomatoes and green chilies until tender.",
    price: 2900,
    category: "Peshawari Mains",
    restaurantId: 1,
    image: "/images/chicken.jpg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: true,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== PESHAWARI SPECIALS ==========
  {
    id: 105,
    name: "Peshawari Sajji (Full)",
    description: "Whole chicken marinated for 24 hours in secret spices, slow-roasted",
    price: 4500,
    category: "Peshawari Specials",
    restaurantId: 1,
    image: "/images/saji.jpeg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: true,
    yearSpecial: false,
    premium: false,
    serves: 4,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== PESHAWARI RICE ==========
  {
    id: 103,
    name: "Shinwari Pulao",
    description: "Fragrant basmati rice with tender mutton pieces and caramelized onions",
    price: 2200,
    category: "Peshawari Rice",
    restaurantId: 1,
    image: "/images/pulao.jpg",
    spicyLevel: 2,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 108,
    name: "Kabuli Pulao",
    description: "Traditional Afghan-style rice with raisins, carrots and lamb",
    price: 2400,
    category: "Peshawari Rice",
    restaurantId: 1,
    image: "/images/kabli.jpg",
    spicyLevel: 2,
    isVegetarian: false,
    vegan: false,
    bestSeller: true,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 127,
    name: "Beef Pulao",
    description: "Aromatic rice dish cooked in beef stock with tender meat chunks and whole spices — a Peshawari classic.",
    price: 2200,
    category: "Peshawari Rice",
    restaurantId: 1,
    image: "/images/beef.jpeg",
    spicyLevel: 2,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: true,
    yearSpecial: true,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  
  // ========== PESHAWARI BREADS ==========
  {
    id: 110,
    name: "Peshawari Naan",
    description: "Traditional wood-fired bread with sesame and kalonji seeds",
    price: 300,
    category: "Peshawari Breads",
    restaurantId: 1,
    image: "/images/naan.webp",
    spicyLevel: 1,
    isVegetarian: true,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== PESHAWARI SIDES ==========
  {
    id: 115,
    name: "Peshawari Kachumber Salad",
    description: "Fresh cucumber, tomato and onion salad with lemon dressing",
    price: 500,
    category: "Peshawari Sides",
    restaurantId: 1,
    image: "/images/salad.jpg",
    spicyLevel: 1,
    isVegetarian: true,
    vegan: true,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== PESHAWARI STREET FOOD ==========
  {
    id: 112,
    name: "Peshawari Chapli Kebab Roll",
    description: "Fresh chapli kebab wrapped in naan with chutney and onions",
    price: 900,
    category: "Peshawari Street Food",
    restaurantId: 1,
    image: "/images/rolkabab.jpg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: true,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  
  // ========== PESHAWARI DESSERTS ==========
  {
    id: 129,
    name: "Shahi Kheer",
    description: "Traditional rice pudding made with milk, sugar, cardamom, and topped with almonds and pistachios.",
    price: 450,
    category: "Peshawari Desserts",
    restaurantId: 1,
    image: "/images/kheer.jpg",
    spicyLevel: 0,
    isVegetarian: true,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== CHINESE CUISINE ==========
  {
    id: 201,
    name: "2025 Dragon Chicken",
    description: "New recipe - Crispy chicken with Sichuan peppercorn glaze",
    price: 1700,
    category: "Chinese",
    restaurantId: 1,
    image: "/images/dragon.jpeg",
    spicyLevel: 4,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: true,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 202,
    name: "Black Pepper Beef",
    description: "Tender beef with freshly ground pepper",
    price: 1900,
    category: "Chinese",
    restaurantId: 1,
    image: "/images/beef.jpg",
    spicyLevel: 3,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 2,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== ITALIAN CUISINE ==========
  {
    id: 301,
    name: "Truffle Mushroom Risotto",
    description: "Creamy Arborio rice with wild mushrooms",
    price: 2100,
    category: "Italian",
    restaurantId: 1,
    image: "/images/mashroom.jpg",
    spicyLevel: 1,
    isVegetarian: true,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: true,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 302,
    name: "2025 Carbonara",
    description: "Updated recipe - Guanciale pasta with organic eggs",
    price: 1800,
    category: "Italian",
    restaurantId: 1,
    image: "/images/carbonara.jpg",
    spicyLevel: 1,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // ========== CONTINENTAL CUISINE ==========
  {
    id: 401,
    name: "Wagyu Slider Trio",
    description: "Japanese A5 wagyu mini burgers",
    price: 3500,
    category: "Continental",
    restaurantId: 1,
    image: "/images/burger.webp",
    spicyLevel: 2,
    isVegetarian: false,
    vegan: false,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: true,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 402,
    name: "Tandoori Cauliflower Steak",
    description: "Spiced cauliflower with tahini",
    price: 1500,
    category: "Continental",
    restaurantId: 1,
    image: "/images/tandori.png",
    spicyLevel: 2,
    isVegetarian: true,
    vegan: true,
    bestSeller: false,
    chefSpecial: false,
    yearSpecial: false,
    premium: false,
    serves: 1,
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  }
];

// ===================================================================
// == OFFERS
// ===================================================================
export const offers = [
  {
    id: 1,
    title: "Peshawari Feast Special",
    description: "25% off our signature Chapli Kabab, Sajji & Lamb Karahi!",
    code: "PESHAWARI25",
    image: "/images/saji.jpeg",
    validUntil: "2025-12-31",
    category: "Peshawari",
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Executive Lunch Deal",
    description: "Any main + naan + drink for PKR 1200 (Regular PKR 1500)",
    code: "LUNCH1200",
    image: "/images/boti.jpg",
    validUntil: "2025-06-30",
    category: "All",
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 3,
    title: "Family Dinner Package",
    description: "Full Sajji, 2 Pulao, 6 Naan & drinks for PKR 6000",
    code: "FAMILY6000",
    image: "/images/kabab.jpeg",
    validUntil: "2025-12-31",
    category: "Peshawari",
    adminId: "admin-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  }
];

// ===================================================================
// == SAMPLE ORDERS
// ===================================================================
export const orders = [
  {
    id: "ORD-1001",
    userId: "user-1",
    items: [
      {
        id: 102, // Peshawari Lamb Karahi
        quantity: 1,
        price: 3200
      },
      {
        id: 108, // Kabuli Pulao
        quantity: 1,
        price: 2400
      }
    ],
    paymentMethod: "cash",
    subtotal: 5600,
    deliveryFee: 200,
    tax: 580,
    total: 6380,
    status: "Delivered",
    restaurantId: 1,
    adminId: "admin-1",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z"
  },
];
export const initialUsers = [
  {
    id: 'admin-1',
    name: 'Nasir Naeem (Admin)',
    email: 'nasirnaeem66@gmail.com',
    password: '123456', // Note: In a real app, never store plain text passwords
    role: 'admin', // Changed from isAdmin: true
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'mod-1',
    name: 'Nasir Naeem (Moderator)',
    email: 'nasirnaeem50@gmail.com',
    password: '123456',
    role: 'moderator', // New moderator role
    createdAt: '2025-01-02T09:00:00Z',
  },
  {
    id: 'user-123',
    name: 'Ayesha Khan',
    email: 'ayesha.k@example.com',
    password: 'password123',
    role: 'customer', // Changed from isAdmin: false
    createdAt: '2025-02-15T14:30:00Z',
  },
  {
    id: 'user-456',
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@example.com',
    password: 'password123',
    role: 'customer', // Changed from isAdmin: false
    createdAt: '2025-03-20T09:00:00Z',
  },
  {
    id: 'user-789',
    name: 'Fatima Ali',
    email: 'fatima.ali@example.com',
    password: 'password123',
    role: 'customer', // Changed from isAdmin: false
    createdAt: '2025-04-10T18:45:00Z',
  },
  {
  id: 'chef-1',
  name: 'Master Chef Ali',
  email: 'chef.ali@restaurant.com',
  password: 'chefpassword',
  role: 'chef',
  createdAt: '2025-01-05T08:00:00Z'
},
{
  id: 'waiter-1',
  name: 'Server Ahmed',
  email: 'ahmed.waiter@restaurant.com',
  password: 'waiterpass',
  role: 'waiter',
  createdAt: '2025-01-10T09:00:00Z'
},
{
  id: 'manager-1',
  name: 'Restaurant Manager',
  email: 'manager@restaurant.com',
  password: 'managerpass',
  role: 'manager',
  createdAt: '2025-01-03T10:00:00Z'
}
]


// ===================================================================
// == ADMIN USER
// ===================================================================
export const adminUser = {
  id: "admin-1",
  name: "Admin User",
  email: "nasirnaeem66@gmail.com",
  password: "123456",
  isAdmin: true,
  token: "admin-token-123",
  createdAt: "2025-01-01T00:00:00Z"
};

// ===================================================================
// == LOCALSTORAGE SYNC FUNCTION
// ===================================================================
let hasInitialized = false;

export const getAndInitializeFoodItems = () => {
  try {
    const storedItemsJSON = localStorage.getItem('foodItems');
    const storedItems = storedItemsJSON ? JSON.parse(storedItemsJSON) : [];

    if (!hasInitialized) {
      const existingIds = new Set(storedItems.map(item => item.id));
      const newItemsToAdd = initialFoodItems.filter(item => !existingIds.has(item.id));

      if (newItemsToAdd.length > 0) {
        const mergedItems = [...storedItems, ...newItemsToAdd];
        localStorage.setItem('foodItems', JSON.stringify(mergedItems));
        hasInitialized = true;
        return mergedItems;
      }
      hasInitialized = true;
    }

    return storedItems.length > 0 ? storedItems : initialFoodItems;

  } catch (error) {
    console.error('Error with food items:', error);
    return initialFoodItems;
  }
};

