export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  artisan: {
    name: string;
    location: string;
    avatar: string;
    bio: string;
  };
  images: string[];
  category: string;
  tags: string[];
  canPersonalize?: boolean;
  stock?: number;
  reviews: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  badge?: "New Arrival" | "Limited Edition" | "Bestseller";
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "hand-thrown-ceramic-vase",
    name: "Ceramic Vase in Rose",
    price: 85,
    badge: "Limited Edition",
    description: "Each vase is uniquely shaped by hand on a traditional potter's wheel. The subtle rose glaze is achieved through a double-firing process, creating a textured, matte finish that feels as good as it looks. Perfect for dried flowers or as a standalone sculptural piece.",
    artisan: {
      name: "Elena Ross",
      location: "Cotswolds, UK",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      bio: "Working from my garden studio, I focus on minimalist forms and organic textures. Every piece I make carries the rhythm of the wheel."
    },
    images: ["/hero.png"],
    category: "Ceramics",
    canPersonalize: true,
    tags: ["Minimalist", "Home Decor", "Handmade"],
    reviews: [
      {
        user: "James W.",
        rating: 5,
        comment: "Absolutely stunning. You can see the craftsmanship in every curve.",
        date: "2024-03-15"
      }
    ]
  },
  {
    id: "luxury-linen-journal",
    name: "Linen-Bound Journal",
    price: 42,
    badge: "New Arrival",
    description: "A handcrafted journal bound in premium deep green linen. Features archival-quality 120gsm paper, perfect for fountain pens and sketches. Each book is hand-sewn for lay-flat writing.",
    artisan: {
      name: "Marcus Thorne",
      location: "Vancouver, CA",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      bio: "Master bookbinder with a passion for traditional techniques and sustainable materials."
    },
    images: ["/journal.png"],
    category: "Stationery",
    canPersonalize: true,
    tags: ["Personalized", "Gift", "Craft"],
    reviews: []
  },
  {
    id: "gold-minimal-earrings",
    name: "18k Minimal Earrings",
    price: 120,
    badge: "Bestseller",
    description: "Solid 18k gold earrings with a brushed satin finish. Designed for everyday elegance, these lightweight pieces are handcrafted to last a lifetime.",
    artisan: {
      name: "Sia Jewelry",
      location: "Milan, IT",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sia",
      bio: "Third-generation jeweler focused on geometric simplicity and ethical gold sourcing."
    },
    images: ["/earrings.png"],
    category: "Jewelry",
    tags: ["Luxury", "Gold", "Handmade"],
    reviews: []
  },
  {
    id: "vintage-brass-compass",
    name: "Explorer's Brass Compass",
    price: 95,
    description: "A faithful reproduction of a Victorian-era nautical compass. Hand-aged brass and glass.",
    artisan: {
      name: "Arthur Wells",
      location: "Bristol, UK",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur",
      bio: "Restorer of antique instruments and maker of historical scientific replicas."
    },
    images: ["/hero.png"],
    category: "Vintage",
    tags: ["History", "Collectibles", "Decor"],
    reviews: []
  },
  {
    id: "hand-woven-wool-blanket",
    name: "Arctic Wool Blanket",
    price: 210,
    description: "Woven from raw organic wool. Heavyweight, breathable, and timeless.",
    artisan: {
      name: "Ingrid Sol",
      location: "Oslo, NO",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ingrid",
      bio: "Keeping the Nordic weaving tradition alive through sustainable, farm-to-loom textiles."
    },
    images: ["/hero.png"],
    category: "Home",
    tags: ["Sustainable", "Winter", "Craft"],
    reviews: []
  }
];
