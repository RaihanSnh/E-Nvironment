"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home, ArrowRight } from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  total: number;
};

export default function CheckoutSuccess() {
  const { items: cartItems, clearCart, totalPrice: cartTotal, isLoading: isCartLoading } = useCart();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [orderProcessed, setOrderProcessed] = useState(false);

  useEffect(() => {
    if (isCartLoading) {
      return;
    }

    let sourceItems = cartItems;
    if ((sourceItems === undefined || sourceItems.length === 0) && !orderProcessed) {
      const snapshot = localStorage.getItem('lastCheckedOutItems');
      if (snapshot) {
        try {
          sourceItems = JSON.parse(snapshot);
        } catch (e) {
          console.error('Failed to parse lastCheckedOutItems', e);
        }
      }
    }

    if (sourceItems && sourceItems.length > 0 && !orderProcessed) {
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        date: new Date().toISOString(),
        status: 'Processing',
        items: sourceItems.map((item: CartItem) => ({
          name: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total: cartTotal > 0 ? cartTotal : sourceItems.reduce((sum, item: CartItem) => sum + item.product.price * item.quantity, 0),
      };

      const storedOrders = localStorage.getItem('orderHistory');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.unshift(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orders));

      setConfirmedOrder(newOrder);
      setOrderProcessed(true);
      clearCart();
      localStorage.removeItem('lastCheckedOutItems');
    }
  }, [cartItems, orderProcessed, clearCart, cartTotal, isCartLoading]);
  
  return (
    <div className="py-24">
      <Container>
        <Card className="medieval-card max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="medieval-heading mb-2">Order Confirmed!</h1>
            
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            
            {confirmedOrder && (
              <div className="medieval-card p-4 mb-6">
                <h3 className="font-medium mb-1">Order Details</h3>
                <p className="text-sm text-muted-foreground">Order Number: {confirmedOrder.id}</p>
                <p className="text-sm text-muted-foreground">Date: {new Date(confirmedOrder.date).toLocaleDateString()}</p>
              </div>
            )}
            
            <div className="medieval-card p-4 bg-primary/10">
              <p className="text-sm font-medium mb-2">
                Eco Impact
              </p>
              <p className="text-sm text-muted-foreground">
                By purchasing eco-friendly products, you&apos;ve contributed to environmental sustainability. You&apos;ve earned eco coins for your purchase!
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 p-8 pt-0">
            <Link href="/shop" className="w-full">
              <Button 
                className="medieval-button rounded-md w-full flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/profile?tab=orders" className="w-full">
              <Button 
                variant="outline"
                className="rounded-md w-full flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                View Your Orders
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button 
                variant="ghost"
                className="rounded-md w-full flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
} 