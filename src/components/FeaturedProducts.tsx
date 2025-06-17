"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductsContext";
import ProductCard from "./ProductCard";
import Container from "./Container";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts();
  
  const featuredProducts = useMemo(() => {
    // Get top 4 products with highest eco impact and in stock
    return [...products]
      .filter(product => product.stock > 0)
      .sort((a, b) => (b.ecoImpact || 0) - (a.ecoImpact || 0))
      .slice(0, 4);
  }, [products]);
  
  if (loading) {
    return (
      <div className="medieval-section">
        <Container className="py-12">
          <h2 className="medieval-heading text-center mb-8">
            Featured Environmental Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index} 
                className="medieval-card h-80 animate-pulse"
              />
            ))}
          </div>
        </Container>
      </div>
    );
  }
  
  if (error || featuredProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="medieval-section">
      <Container className="py-12">
        <div className="scroll-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="medieval-heading mb-4 md:mb-0">
              From the Royal Armoury
            </h2>
            <Link href="/shop">
              <Button variant="outline" className="rounded-md flex items-center gap-2 medieval-button">
                View All Wares
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="medieval-quote max-w-2xl mx-auto">
              Hark, traveller! These legendary artifacts are our finest, forged to aid thee on thy noble quests.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FeaturedProducts;