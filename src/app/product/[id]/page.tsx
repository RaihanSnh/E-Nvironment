"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Star, 
  Leaf, 
  BadgePlus, 
  BadgeMinus,
  ArrowRight
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const product = getProductById(productId);
  
  // Handle if product is not found
  if (!product) {
    return (
      <div className="py-24">
        <Container>
          <div className="medieval-card p-8 text-center">
            <h1 className="medieval-heading mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you are looking for doesn&apos;t exist or has been removed.
            </p>
            <Button 
              className="medieval-button rounded-md"
              onClick={() => router.push('/shop')}
            >
              Back to Shop
            </Button>
          </div>
        </Container>
      </div>
    );
  }
  
  // Calculate discounted price
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
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  return (
    <div className="py-12">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-muted-foreground">
          <Link href="/shop" className="flex items-center hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="medieval-card overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={activeImageIndex === 0 ? product.thumbnail : product.images[activeImageIndex - 1]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-bold">
                    -{Math.round(product.discountPercentage)}% OFF
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              <button
                className={`medieval-card p-1 overflow-hidden ${activeImageIndex === 0 ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImageIndex(0)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.thumbnail}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </div>
              </button>
              
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`medieval-card p-1 overflow-hidden ${activeImageIndex === index + 1 ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveImageIndex(index + 1)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 10vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="medieval-heading mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-primary fill-current" />
                <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center px-2 py-1 bg-primary/10 rounded-md">
                <Leaf className={`h-4 w-4 mr-1 ${getEcoImpactColor(product.ecoImpact)}`} />
                <span className={`font-medium ${getEcoImpactColor(product.ecoImpact)}`}>
                  {product.ecoImpact}/10 Eco Impact
                </span>
              </div>
              
              <div className="text-sm">
                <span className={product.stock > 0 ? 'text-green-600' : 'text-destructive'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-muted-foreground"> (Only {product.stock} left)</span>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-md uppercase">
                {product.ecoCategory?.replace(/-/g, ' ')}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                by <span className="font-medium">{product.brand}</span>
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-foreground leading-relaxed mb-4">
                {product.description}
              </p>
              
              {product.carbonReduction && (
                <div className="medieval-card p-3 flex items-center gap-2 mb-4">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <span className="text-sm">
                    This product helps reduce approximately <strong>{product.carbonReduction}kg</strong> of CO₂ emissions annually.
                  </span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {product.stock > 0 ? (
                <div className="flex gap-4">
                  <div className="flex items-center border border-input rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <BadgeMinus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <BadgePlus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="medieval-button rounded-md flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              ) : (
                <Button 
                  className="medieval-button rounded-md w-full opacity-50"
                  disabled
                >
                  Out of Stock
                </Button>
              )}
            </div>
            
            {/* Environmental Benefits */}
            <Card className="medieval-card p-5">
              <h3 className="font-semibold text-lg mb-3">Environmental Benefits</h3>
              <ul className="space-y-2">
                {product.ecoBenefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
} 