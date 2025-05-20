"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define types for product data
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  // Environment-related attributes
  ecoCategory?: string;
  ecoBenefits?: string[];
  ecoImpact?: number; // Rating from 1-10 on environmental impact
  carbonReduction?: number; // Estimated CO2 reduction in kg
}

// Define the IoT categories
export const IoTCategories = [
  { id: "smart-waste", name: "Smart Waste Management", icon: "🗑️" },
  { id: "water-conservation", name: "Water Conservation", icon: "💧" },
  { id: "energy-efficiency", name: "Energy Efficiency", icon: "⚡" },
  { id: "air-quality", name: "Air Quality Monitoring", icon: "🌬️" },
  { id: "sustainable-gardening", name: "Sustainable Gardening", icon: "🌱" },
  { id: "home-automation", name: "Home Automation", icon: "🏠" },
  { id: "wearable-eco-tech", name: "Wearable Eco-Tech", icon: "⌚" },
  { id: "renewable-energy", name: "Renewable Energy", icon: "☀️" },
  { id: "recycling-tools", name: "Recycling Tools", icon: "♻️" },
  { id: "eco-monitoring", name: "Eco Monitoring", icon: "📊" }
];

interface ProductsContextType {
  products: Product[];
  categories: typeof IoTCategories;
  loading: boolean;
  error: string | null;
  filterProducts: (options: FilterOptions) => Product[];
  getProductById: (id: number) => Product | undefined;
}

export interface FilterOptions {
  category?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
  sortBy?: 'rating' | 'discount' | 'priceHigh' | 'priceLow' | 'stock' | 'reviews' | 'ecoImpact';
  ecoMinimum?: number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Map dummy categories to our IoT categories
const mapCategoryToEcoCategory = (category: string, id: number): string => {
  const categoryMap: Record<string, string[]> = {
    "smartphones": ["wearable-eco-tech", "eco-monitoring"],
    "laptops": ["energy-efficiency", "eco-monitoring"],
    "fragrances": ["air-quality"],
    "skincare": ["sustainable-gardening"],
    "groceries": ["sustainable-gardening"],
    "home-decoration": ["home-automation"],
    "furniture": ["recycling-tools"],
    "tops": ["recycling-tools"],
    "womens-dresses": ["recycling-tools"],
    "womens-shoes": ["recycling-tools"],
    "mens-shirts": ["recycling-tools"],
    "mens-shoes": ["recycling-tools"],
    "mens-watches": ["wearable-eco-tech"],
    "womens-watches": ["wearable-eco-tech"],
    "womens-bags": ["recycling-tools"],
    "womens-jewellery": ["recycling-tools"],
    "sunglasses": ["wearable-eco-tech"],
    "automotive": ["energy-efficiency"],
    "motorcycle": ["energy-efficiency"],
    "lighting": ["energy-efficiency", "home-automation"]
  };

  // Use the id to distribute products more evenly across categories
  if (category in categoryMap) {
    const possibleCategories = categoryMap[category];
    return possibleCategories[id % possibleCategories.length];
  }
  
  // Default categories for items that don't match
  const allCategoryIds = IoTCategories.map(cat => cat.id);
  return allCategoryIds[id % allCategoryIds.length];
};

// Create eco benefits based on category
const getEcoBenefits = (ecoCategory: string): string[] => {
  const benefitsMap: Record<string, string[]> = {
    "smart-waste": [
      "Reduces landfill waste by 30%",
      "Optimizes waste collection routes",
      "Monitors fill levels in real-time"
    ],
    "water-conservation": [
      "Saves up to 70% of water usage",
      "Detects leaks instantly",
      "Smart irrigation based on weather"
    ],
    "energy-efficiency": [
      "Reduces energy consumption by 25%",
      "Smart power management",
      "Energy usage analytics"
    ],
    "air-quality": [
      "Monitors indoor air pollutants",
      "Alerts for unhealthy air conditions",
      "Automated air purification"
    ],
    "sustainable-gardening": [
      "Promotes biodiversity",
      "Reduces water usage in gardening",
      "Monitors soil health"
    ],
    "home-automation": [
      "Reduces overall energy usage",
      "Smart scheduling of appliances",
      "Occupancy-based energy management"
    ],
    "wearable-eco-tech": [
      "Tracks personal carbon footprint",
      "Encourages sustainable habits",
      "Energy harvesting technology"
    ],
    "renewable-energy": [
      "Solar power integration",
      "Energy storage solutions",
      "Sustainable power generation"
    ],
    "recycling-tools": [
      "Improves recycling accuracy",
      "Reduces contamination in recycling",
      "Tracks recycling metrics"
    ],
    "eco-monitoring": [
      "Environmental data collection",
      "Ecosystem health monitoring",
      "Climate change impact analysis"
    ]
  };

  return benefitsMap[ecoCategory] || [
    "Contributes to environmental sustainability",
    "Reduces carbon footprint",
    "Promotes eco-friendly practices"
  ];
};

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Check localStorage first
        const cachedProducts = localStorage.getItem("envirProductsCache");
        
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
          return;
        }
        
        const response = await axios.get("https://dummyjson.com/products?limit=100");
        
        // Transform products to add environmental attributes
        const enhancedProducts = response.data.products.map((product: Product) => {
          const ecoCategory = mapCategoryToEcoCategory(product.category, product.id);
          const ecoBenefits = getEcoBenefits(ecoCategory);
          const ecoImpact = Math.floor(Math.random() * 5) + 5; // Random 5-10 score
          const carbonReduction = Math.floor(Math.random() * 200) + 50; // Random 50-250 kg
          
          // Create IoT product name prefixes
          const prefixes = [
            "Smart", "Eco", "Green", "Sustainable", "Intelligent", 
            "Connected", "IoT", "Automated", "Solar", "Energy-Efficient"
          ];
          
          // Add a random prefix to the product title
          const prefix = prefixes[product.id % prefixes.length];
          const newTitle = product.title.includes(prefix) 
            ? product.title 
            : `${prefix} ${product.title}`;
            
          // Modify description to focus on environmental benefits
          const envDescription = `This innovative IoT device ${product.description.toLowerCase()}. ${ecoBenefits[0]}.`;
          
          return {
            ...product,
            title: newTitle,
            description: envDescription,
            ecoCategory,
            ecoBenefits,
            ecoImpact,
            carbonReduction,
            // Convert price to be more reasonable for IoT devices
            price: Math.round(product.price * 10000)
          };
        });
        
        setProducts(enhancedProducts);
        
        // Cache the products in localStorage
        localStorage.setItem("envirProductsCache", JSON.stringify(enhancedProducts));
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (options: FilterOptions): Product[] => {
    return products.filter(product => {
      // Filter by IoT category
      if (options.category && product.ecoCategory !== options.category) {
        return false;
      }

      // Filter by minimum rating
      if (options.minRating && product.rating < options.minRating) {
        return false;
      }

      // Filter by price range
      if (options.minPrice && product.price < options.minPrice) {
        return false;
      }
      if (options.maxPrice && product.price > options.maxPrice) {
        return false;
      }

      // Filter by stock availability
      if (options.inStock && product.stock <= 0) {
        return false;
      }
      
      // Filter by minimum eco impact
      if (options.ecoMinimum && product.ecoImpact! < options.ecoMinimum) {
        return false;
      }

      // Filter by search query
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        return (
          (product.title && product.title.toLowerCase().includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.brand && product.brand.toLowerCase().includes(query)) ||
          (product.ecoCategory && product.ecoCategory.toLowerCase().includes(query)) ||
          (product.ecoBenefits && product.ecoBenefits.some(benefit => benefit && benefit.toLowerCase().includes(query)))
        );
      }

      return true;
    }).sort((a, b) => {
      // Sort products based on sortBy option
      if (!options.sortBy) return 0;

      switch (options.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'priceHigh':
          return b.price - a.price;
        case 'priceLow':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'reviews':
          // For this example, we'll use rating as a proxy for reviews
          return b.rating - a.rating;
        case 'ecoImpact':
          return (b.ecoImpact || 0) - (a.ecoImpact || 0);
        default:
          return 0;
      }
    });
  };
  
  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      categories: IoTCategories, 
      loading, 
      error, 
      filterProducts,
      getProductById
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
