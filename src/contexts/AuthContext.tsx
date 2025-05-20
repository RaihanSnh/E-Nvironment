"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  coins: number;
  purchaseHistory: PurchaseRecord[];
}

interface StoredUser extends User {
  password: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  products: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    discountPercentage: number;
    thumbnail: string;
  }[];
  totalAmount: number;
  coinsUsed: number;
  paymentMethod: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addCoins: (amount: number) => void;
  useCoins: (amount: number) => boolean;
  addBalance: (amount: number) => void;
  addPurchaseRecord: (record: Omit<PurchaseRecord, "id" | "date">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    // For this demo, we'll check localStorage for registered users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: StoredUser) => u.email === email && u.password === password);

    if (foundUser) {
      // Remove password from user object before storing in state
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as { password?: string }).password;
      setUser(userWithoutPassword as User);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to register
    // For this demo, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if user already exists
    if (users.some((u: StoredUser) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In a real app, this would be hashed
      balance: 0,
      coins: 0,
      purchaseHistory: []
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Log in the new user
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as { password?: string }).password;
    setUser(userWithoutPassword as User);
    setIsAuthenticated(true);

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addCoins = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        coins: user.coins + amount
      });
    }
  };

  const useCoins = (amount: number): boolean => {
    if (user && user.coins >= amount) {
      setUser({
        ...user,
        coins: user.coins - amount
      });
      return true;
    }
    return false;
  };

  const addBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: user.balance + amount
      });
    }
  };

  const addPurchaseRecord = (record: Omit<PurchaseRecord, "id" | "date">) => {
    if (user) {
      const newRecord: PurchaseRecord = {
        ...record,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };

      setUser({
        ...user,
        purchaseHistory: [newRecord, ...user.purchaseHistory]
      });

      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u: StoredUser) => {
        if (u.id === user.id) {
          return {
            ...u,
            balance: user.balance,
            coins: user.coins,
            purchaseHistory: [newRecord, ...user.purchaseHistory]
          };
        }
        return u;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            isAuthenticated,
            login,
            register,
            logout,
            addCoins,
            useCoins,
            addBalance,
            addPurchaseRecord
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}