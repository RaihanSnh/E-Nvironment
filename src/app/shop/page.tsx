"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/contexts/ProductsContext";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/utils";
import { FilterX, Search, SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { products, categories, loading, filterProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [ecoMinimum, setEcoMinimum] = useState(0);
  
  // Calculate price range based on products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);
  
  // Filter products based on current filters
  const filteredProducts = filterProducts({
    category: selectedCategory,
    minRating,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    inStock,
    searchQuery,
    sortBy: sortBy as any,
    ecoMinimum
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(undefined);
    setMinRating(0);
    setPriceRange([0, 10000000]);
    setInStock(false);
    setSortBy(undefined);
    setEcoMinimum(0);
    setSearchQuery("");
  };
  
  if (loading) {
    return (
      <div className="py-12">
        <Container>
          <h1 className="medieval-heading mb-8 text-center">
            Loading Products...
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="medieval-card h-80 animate-pulse" />
            ))}
          </div>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <Container>
        <h1 className="medieval-heading mb-6 text-center">
          Our <span className="text-primary">Environmental</span> Products
        </h1>
        
        {/* Search Bar and Filter Toggle */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} products found
            </div>
            <Button
              variant="outline"
              className="rounded-md flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            {/* Reset Filters button - only show if filters are applied */}
            {(selectedCategory || minRating > 0 || inStock || sortBy || ecoMinimum > 0 || searchQuery) && (
              <Button
                variant="ghost"
                className="rounded-md flex items-center gap-2"
                onClick={resetFilters}
              >
                <FilterX className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <Card className="medieval-card lg:sticky lg:top-24 h-fit">
              <CardContent className="p-4">
                <h2 className="font-semibold text-xl mb-4">Filters</h2>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        size="sm"
                        className={`justify-start w-full rounded-md ${
                          selectedCategory === category.id ? 'bg-primary/20' : ''
                        }`}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? undefined : category.id
                        )}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Price Range</h3>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={10000000}
                    step={10000}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="mb-2"
                  />
                </div>
                
                {/* Eco Impact */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Minimum Eco Impact</h3>
                    <span className="text-sm text-muted-foreground">
                      {ecoMinimum}/10
                    </span>
                  </div>
                  <Slider
                    defaultValue={[ecoMinimum]}
                    max={10}
                    step={1}
                    value={[ecoMinimum]}
                    onValueChange={(value) => setEcoMinimum(value[0])}
                    className="mb-2"
                  />
                </div>
                
                {/* Minimum Rating */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Minimum Rating</h3>
                    <span className="text-sm text-muted-foreground">
                      {minRating} ★
                    </span>
                  </div>
                  <Slider
                    defaultValue={[minRating]}
                    max={5}
                    step={0.5}
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    className="mb-2"
                  />
                </div>
                
                {/* In Stock Toggle */}
                <div className="mb-6 flex items-center justify-between">
                  <Label htmlFor="in-stock" className="font-medium">
                    In Stock Only
                  </Label>
                  <Switch
                    id="in-stock"
                    checked={inStock}
                    onCheckedChange={setInStock}
                  />
                </div>
                
                {/* Sort Options */}
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Sort By</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-md ${sortBy === 'rating' ? 'bg-primary/20' : ''}`}
                      onClick={() => setSortBy(sortBy === 'rating' ? undefined : 'rating')}
                    >
                      Top Rated
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-md ${sortBy === 'discount' ? 'bg-primary/20' : ''}`}
                      onClick={() => setSortBy(sortBy === 'discount' ? undefined : 'discount')}
                    >
                      Best Discount
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-md ${sortBy === 'priceHigh' ? 'bg-primary/20' : ''}`}
                      onClick={() => setSortBy(sortBy === 'priceHigh' ? undefined : 'priceHigh')}
                    >
                      Price High-Low
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-md ${sortBy === 'priceLow' ? 'bg-primary/20' : ''}`}
                      onClick={() => setSortBy(sortBy === 'priceLow' ? undefined : 'priceLow')}
                    >
                      Price Low-High
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-md ${sortBy === 'ecoImpact' ? 'bg-primary/20' : ''}`}
                      onClick={() => setSortBy(sortBy === 'ecoImpact' ? undefined : 'ecoImpact')}
                    >
                      Eco Impact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Product Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${showFilters ? '3' : '4'} gap-6 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={resetFilters} className="rounded-md">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 