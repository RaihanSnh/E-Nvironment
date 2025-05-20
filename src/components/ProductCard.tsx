"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { ShoppingCart, Leaf } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  
  // Generate eco impact color based on the score
  const getEcoImpactColor = (impact: number = 0) => {
    if (impact >= 8) return "text-green-500";
    if (impact >= 5) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <Card className="medieval-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-bold">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-bold">
              Only {product.stock} left!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <p className="text-foreground font-bold text-lg">Out of Stock</p>
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Link href={`/product/${product.id}`} className="flex-1">
            <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
              {product.title}
            </CardTitle>
          </Link>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
            <Leaf className={`h-4 w-4 ${getEcoImpactColor(product.ecoImpact)}`} />
            <span className={`text-sm font-medium ${getEcoImpactColor(product.ecoImpact)}`}>
              {product.ecoImpact}/10
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <span className="text-primary">★</span>
            <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-md">
            {product.ecoCategory?.replace(/-/g, ' ')}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 h-10">
          {product.description}
        </p>
        
        {product.carbonReduction && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Leaf className="h-3 w-3 mr-1 text-green-500" />
            <span>Reduces {product.carbonReduction}kg CO₂ annually</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-col">
          {product.discountPercentage > 0 ? (
            <>
              <span className="text-lg font-bold">{formatPrice(discountedPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
        
        <Button 
          className="medieval-button rounded-md" 
          size="sm"
          disabled={product.stock === 0}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;