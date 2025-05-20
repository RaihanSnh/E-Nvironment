"use client";

import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuestProvider } from "@/contexts/QuestContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <QuestProvider>
              {children}
            </QuestProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}