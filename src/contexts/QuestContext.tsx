"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface Quest {
  id: string;
  title: string;
  description: string;
  coinReward: number;
  completed: boolean;
  type: "recycle" | "dispose" | "purchase" | "daily";
  requiredAmount?: number;
  currentAmount?: number;
}

interface QuestContextType {
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  availableQuests: Quest[];
  userCoins: number;
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, amount: number) => void;
  resetDailyQuests: () => void;
  startQuest: (questId: string) => void;
  addUserCoins: (amount: number) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

// Initial quests
const initialQuests: Omit<Quest, "completed" | "currentAmount">[] = [
  {
    id: "q1",
    title: "Dispose Waste Properly",
    description: "Dispose of waste in the correct bin",
    coinReward: 5,
    type: "dispose",
    requiredAmount: 1
  },
  {
    id: "q2",
    title: "Recycle Plastic",
    description: "Recycle 3 plastic items",
    coinReward: 10,
    type: "recycle",
    requiredAmount: 3
  },
  {
    id: "q3",
    title: "Recycle Paper",
    description: "Recycle 5 paper items",
    coinReward: 15,
    type: "recycle",
    requiredAmount: 5
  },
  {
    id: "q4",
    title: "Purchase Eco-Friendly Product",
    description: "Buy an eco-friendly product from our store",
    coinReward: 20,
    type: "purchase"
  },
  {
    id: "q5",
    title: "Daily Login",
    description: "Log in to the app daily",
    coinReward: 2,
    type: "daily"
  }
];

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userCoins, setUserCoins] = useState<number>(0);
  const { user, addCoins } = useAuth();

  // Initialize quests from localStorage or use default quests
  useEffect(() => {
    if (user) {
      // Load quests
      const storedQuests = localStorage.getItem(`quests_${user.id}`);
      if (storedQuests) {
        try {
          setQuests(JSON.parse(storedQuests));
        } catch (error) {
          console.error("Failed to parse quests from localStorage:", error);
          initializeDefaultQuests();
        }
      } else {
        initializeDefaultQuests();
      }
      
      // Load user coins
      const storedCoins = localStorage.getItem(`coins_${user.id}`);
      if (storedCoins) {
        try {
          setUserCoins(parseInt(storedCoins, 10) || 0);
        } catch (error) {
          console.error("Failed to parse coins from localStorage:", error);
          setUserCoins(0);
        }
      }
    }
  }, [user]);

  // Save quests to localStorage when they change
  useEffect(() => {
    if (user && quests.length > 0) {
      localStorage.setItem(`quests_${user.id}`, JSON.stringify(quests));
    }
  }, [quests, user]);
  
  // Save coins to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`coins_${user.id}`, userCoins.toString());
    }
  }, [userCoins, user]);

  // Initialize default quests
  const initializeDefaultQuests = () => {
    const defaultQuests = initialQuests.map(quest => ({
      ...quest,
      completed: false,
      currentAmount: 0
    }));
    setQuests(defaultQuests);
  };

  // Complete a quest and award coins
  const completeQuest = (questId: string) => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.id === questId && !quest.completed) {
          // Award coins
          addUserCoins(quest.coinReward);
          return { ...quest, completed: true };
        }
        return quest;
      })
    );
  };
  
  // Start a quest
  const startQuest = (questId: string) => {
    // Implementation can be added as needed
    console.log(`Starting quest ${questId}`);
  };
  
  // Add or subtract user coins
  const addUserCoins = (amount: number) => {
    setUserCoins(prev => Math.max(0, prev + amount));
    // Also update the auth context if needed
    if (addCoins) {
      addCoins(amount);
    }
  };

  // Update progress for quests with required amounts
  const updateQuestProgress = (questId: string, amount: number) => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.id === questId && !quest.completed && quest.requiredAmount) {
          const newAmount = (quest.currentAmount || 0) + amount;
          
          // Check if quest is completed
          if (newAmount >= quest.requiredAmount) {
            // Award coins
            addUserCoins(quest.coinReward);
            return { 
              ...quest, 
              currentAmount: quest.requiredAmount, 
              completed: true 
            };
          }
          
          return { 
            ...quest, 
            currentAmount: newAmount 
          };
        }
        return quest;
      })
    );
  };

  // Reset daily quests at midnight
  const resetDailyQuests = () => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.type === "daily") {
          return { 
            ...quest, 
            completed: false,
            currentAmount: 0
          };
        }
        return quest;
      })
    );
  };

  // Check for daily reset
  useEffect(() => {
    if (user) {
      const lastResetDate = localStorage.getItem(`lastQuestReset_${user.id}`);
      const today = new Date().toDateString();
      
      if (lastResetDate !== today) {
        resetDailyQuests();
        localStorage.setItem(`lastQuestReset_${user.id}`, today);
      }
    }
  }, [user]);
  
  // Derived state
  const activeQuests = quests.filter(quest => !quest.completed) || [];
  const completedQuests = quests.filter(quest => quest.completed) || [];
  const availableQuests = initialQuests.map(q => ({...q, completed: false, currentAmount: 0})) || [];

  return (
    <QuestContext.Provider value={{ 
      quests, 
      activeQuests,
      completedQuests,
      availableQuests,
      userCoins,
      completeQuest, 
      updateQuestProgress, 
      resetDailyQuests,
      startQuest,
      addUserCoins
    }}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error("useQuests must be used within a QuestProvider");
  }
  return context;
}