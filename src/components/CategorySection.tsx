"use client";

import React from "react";
import Link from "next/link";
import Container from "./Container";
import { Card, CardContent } from "./ui/card";

const CategorySection = () => {
  // IoT and environment-related categories
  const categories = [
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
  
  return (
    <div className="medieval-section">
      <Container className="py-12">
        <h2 className="medieval-heading text-center mb-8">
          Explore <span className="text-primary">Sustainable</span> Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(category => (
            <Link key={category.id} href={`/shop?category=${category.id}`}>
              <Card className="medieval-card h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <div className="text-3xl mb-3 bg-primary/10 p-3 rounded-full">{category.icon}</div>
                  <p className="text-sm font-medium">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CategorySection;