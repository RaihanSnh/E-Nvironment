"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useQuests } from "@/contexts/QuestContext";
import Container from "@/components/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  BadgePlus,
  BadgeMinus,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Loader2,
  Scroll
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems = [], removeFromCart, updateQuantity, clearCart } = useCart();
  const { addUserCoins, userCoins } = useQuests();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [appliedCoins, setAppliedCoins] = useState(0);
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = calculateDiscountedPrice(
      item.product.price,
      item.product.discountPercentage
    );
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const shipping = subtotal > 0 ? 50000 : 0; // Free shipping over certain amount
  const coinDiscount = (appliedCoins / 10) * 5000; // 10 coins = 5000 rupiah discount
  const total = subtotal + shipping - discount - coinDiscount;
  
  // Apply coupon code
  const applyCoupon = () => {
    // Simple coupon system - in a real app would validate against backend
    if (couponCode.toLowerCase() === "eco2023") {
      setDiscount(subtotal * 0.10); // 10% discount
    } else if (couponCode.toLowerCase() === "firstbuy") {
      setDiscount(50000); // Flat 50k discount
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };
  
  // Handle checkout process
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      // If using coins, reduce user's coin balance
      if (appliedCoins > 0) {
        addUserCoins(-appliedCoins);
      }
      
      // Add purchase quest completion
      if (cartItems.length > 0) {
        // In a real app, would track which specific quests were completed
      }
      
      // Clear cart and redirect to success page
      clearCart();
      router.push('/checkout/success');
    }, 2000);
  };
  
  // Apply user coins to purchase
  const applyCoins = (amount: number) => {
    if (amount <= userCoins) {
      setAppliedCoins(amount);
    }
  };
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <Container>
          <div className="medieval-divider"></div>
          <Card className="medieval-card p-8 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-primary" />
              </div>
              <h1 className="medieval-heading mb-2">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">
                The treasure chest awaits to be filled with environmental wonders.
              </p>
              <div className="medieval-quote mb-8">
                "Every purchase is a step towards a greener kingdom."
              </div>
              <Link href="/shop">
                <Button className="medieval-button rounded-md flex items-center gap-2 px-6 py-3 text-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Browse the Royal Market
                </Button>
              </Link>
            </div>
          </Card>
          <div className="medieval-divider"></div>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <Container>
        <div className="text-center mb-8">
          <h1 className="medieval-heading">
            Your <span className="text-primary">Royal</span> Treasure
          </h1>
          <p className="text-muted-foreground mt-2">
            Review your chosen artifacts before completing your quest
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Scroll className="h-5 w-5 mr-2 text-primary" />
                Scroll of Items ({cartItems.length})
              </h2>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-destructive"
                onClick={() => clearCart()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            {cartItems.map((item) => {
              const itemPrice = calculateDiscountedPrice(
                item.product.price,
                item.product.discountPercentage
              );
              
              return (
                <Card key={item.product.id} className="medieval-card overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <Link 
                          href={`/product/${item.product.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.title}
                        </Link>
                        
                        <div className="mt-1 flex items-center">
                          <span className="medieval-badge">
                            {item.product.ecoCategory?.replace(/-/g, ' ')}
                          </span>
                          
                          {item.product.ecoImpact && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Eco Impact: {item.product.ecoImpact}/10
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center border border-input rounded-md">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <BadgeMinus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <BadgePlus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-medium">
                          {formatPrice(itemPrice)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.quantity > 1 && `${formatPrice(itemPrice)} each`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="medieval-card sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center border-b border-primary/20 pb-2">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Royal Treasury
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Eco Coins Discount</span>
                      <span>-{formatPrice(coinDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Apply Coupon */}
                <div className="mt-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Royal decree (coupon)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      onClick={applyCoupon}
                      className="rounded-md"
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                
                {/* Apply Eco Coins */}
                {userCoins > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-sm mb-2">Apply Eco Coins</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="medieval-card px-3 py-1.5 text-sm flex items-center gap-1.5">
                        <span className="text-primary font-medium">🪙</span>
                        <span>{userCoins} coins available</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        (10 coins = ₹5,000 off)
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 10, 20, 50].map(coins => (
                        <Button
                          key={coins}
                          variant="outline"
                          size="sm"
                          className={`rounded-md ${appliedCoins === coins ? 'bg-primary/20' : ''}`}
                          onClick={() => applyCoins(coins)}
                          disabled={coins > userCoins}
                        >
                          {coins > 0 ? `${coins} 🪙` : 'None'}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="medieval-button rounded-md w-full py-6 text-lg"
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Completing Quest...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Complete Purchase
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  By proceeding, you'll earn eco quest rewards and contribute to a greener realm.
                </p>
              </CardFooter>
            </Card>
            
            {/* Continue Shopping */}
            <div className="mt-4">
              <Link href="/shop">
                <Button 
                  variant="outline" 
                  className="w-full rounded-md flex items-center justify-center gap-2 py-5"
                >
                  <ArrowRight className="h-4 w-4" />
                  Return to the Royal Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 