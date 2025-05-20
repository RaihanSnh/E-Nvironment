"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuests } from "@/contexts/QuestContext";
import { useAuth } from "@/contexts/AuthContext";
import Container from "@/components/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Medal, 
  Leaf, 
  Recycle, 
  ShoppingBag, 
  Calendar, 
  Trophy, 
  ChevronRight,
  CheckCircle,
  AlertCircle 
} from "lucide-react";

export default function QuestsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { 
    userCoins, 
    activeQuests, 
    completedQuests, 
    completeQuest, 
    startQuest, 
    availableQuests 
  } = useQuests();
  const [questStarted, setQuestStarted] = useState<number | null>(null);
  const [questCompleted, setQuestCompleted] = useState<number | null>(null);
  
  // Complete a quest
  const handleCompleteQuest = (questId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    setQuestCompleted(questId);
    
    // Simulate quest completion
    setTimeout(() => {
      completeQuest(questId.toString());
      setQuestCompleted(null);
    }, 1500);
  };
  
  // Start a quest
  const handleStartQuest = (questId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    setQuestStarted(questId);
    
    // Simulate quest starting
    setTimeout(() => {
      startQuest(questId.toString());
      setQuestStarted(null);
    }, 1000);
  };
  
  // Get icon based on quest type
  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'recycle':
        return <Recycle className="h-5 w-5 text-primary" />;
      case 'dispose':
        return <Leaf className="h-5 w-5 text-secondary" />;
      case 'purchase':
        return <ShoppingBag className="h-5 w-5 text-accent" />;
      case 'daily':
        return <Calendar className="h-5 w-5 text-primary" />;
      default:
        return <Medal className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="medieval-heading">
              Eco <span className="text-primary">Quests</span>
            </h1>
            <p className="text-muted-foreground">
              Complete environmental challenges and earn rewards
            </p>
          </div>
          
          {isAuthenticated && (
            <div className="medieval-card px-4 py-2 flex items-center gap-2">
              <span className="text-primary font-medium">🪙</span>
              <span className="font-semibold">{userCoins} Eco Coins</span>
            </div>
          )}
        </div>
        
        {isAuthenticated ? (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="w-full max-w-md rounded-md mx-auto grid grid-cols-3">
              <TabsTrigger value="active" className="rounded-none">
                <Leaf className="h-4 w-4 mr-2" /> Active
              </TabsTrigger>
              <TabsTrigger value="available" className="rounded-none">
                <Medal className="h-4 w-4 mr-2" /> Available
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-none">
                <Trophy className="h-4 w-4 mr-2" /> Completed
              </TabsTrigger>
            </TabsList>
            
            {/* Active Quests */}
            <TabsContent value="active">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeQuests.length > 0 ? (
                  activeQuests.map(quest => (
                    <Card key={quest.id} className="medieval-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getQuestIcon(quest.type)}
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                          </div>
                          <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-md capitalize">
                            {quest.type}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          {quest.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <span className="text-primary font-medium">🪙</span>
                            <span className="font-medium">{quest.coinReward} coins</span>
                          </div>
                          
                          {quest.requiredAmount ? (
                            <div className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                              Progress: {quest.currentAmount || 0}/{quest.requiredAmount}
                            </div>
                          ) : null}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="medieval-button rounded-md w-full"
                          disabled={
                            questCompleted === Number(quest.id) || 
                            (quest.requiredAmount !== undefined && 
                             ((quest.currentAmount ?? 0) < quest.requiredAmount))
                          }
                          onClick={() => handleCompleteQuest(Number(quest.id))}
                        >
                          {questCompleted === Number(quest.id) ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
                              Completing...
                            </>
                          ) : quest.requiredAmount !== undefined && 
                             ((quest.currentAmount ?? 0) < quest.requiredAmount) ? (
                            "In Progress"
                          ) : (
                            "Complete Quest"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="medieval-card p-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Active Quests</h3>
                                            <p className="text-muted-foreground mb-6">                        You don&apos;t have any active quests right now. Start a new quest to earn eco coins!                      </p>
                      <Button 
                        className="medieval-button rounded-md inline-flex"
                        onClick={() => router.push("#available")}
                      >
                        <Medal className="mr-2 h-4 w-4" />
                        Browse Available Quests
                      </Button>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Available Quests */}
            <TabsContent value="available" id="available">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableQuests.length > 0 ? (
                  availableQuests
                    .filter(quest => !activeQuests.some(aq => aq.id === quest.id) && 
                                    !completedQuests.some(cq => cq.id === quest.id))
                    .map(quest => (
                      <Card key={quest.id} className="medieval-card">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getQuestIcon(quest.type)}
                              <CardTitle className="text-lg">{quest.title}</CardTitle>
                            </div>
                            <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-md capitalize">
                              {quest.type}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-muted-foreground mb-4">
                            {quest.description}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <span className="text-primary font-medium">🪙</span>
                              <span className="font-medium">{quest.coinReward} coins</span>
                            </div>
                            
                            {quest.requiredAmount ? (
                              <div className="text-xs text-muted-foreground">
                                Requires {quest.requiredAmount} actions
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="medieval-button rounded-md w-full"
                            disabled={questStarted === Number(quest.id)}
                            onClick={() => handleStartQuest(Number(quest.id))}
                          >
                            {questStarted === Number(quest.id) ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
                                Starting...
                              </>
                            ) : (
                              <>
                                Start Quest <ChevronRight className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-full">
                    <Card className="medieval-card p-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Available Quests</h3>
                      <p className="text-muted-foreground mb-6">
                        There are no new quests available right now. Check back later for more eco-challenges!
                      </p>
                      <Link href="/shop">
                        <Button className="medieval-button rounded-md">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Browse Eco Products
                        </Button>
                      </Link>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Completed Quests */}
            <TabsContent value="completed">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedQuests.length > 0 ? (
                  completedQuests.map(quest => (
                    <Card key={quest.id} className="medieval-card bg-primary/5">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getQuestIcon(quest.type)}
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-md">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Completed</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          {quest.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <span className="text-primary font-medium">🪙</span>
                            <span className="font-medium">+{quest.coinReward} coins</span>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Completed on {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="medieval-card p-2 text-center w-full text-sm text-muted-foreground bg-green-500/5">
                          <p>Thank you for your contribution to the environment!</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="medieval-card p-8 text-center">
                      <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Completed Quests</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven&apos;t completed any quests yet. Complete eco-friendly activities to earn rewards!
                      </p>
                      <Button 
                        className="medieval-button rounded-md"
                        onClick={() => router.push("#available")}
                      >
                        <Medal className="mr-2 h-4 w-4" />
                        Find Quests to Complete
                      </Button>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="medieval-card p-8 text-center max-w-2xl mx-auto">
            <Medal className="h-16 w-16 mx-auto text-primary/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join Our Eco Community</h2>
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to start completing eco-friendly quests and earn coin rewards.
              Use your earned coins for discounts on sustainable IoT products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="medieval-button rounded-md">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="rounded-md">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-16 medieval-card p-6">
          <h2 className="text-xl font-bold mb-4">How Eco Quests Work</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Medal className="h-8 w-8" />
              </div>
              <h3 className="font-medium mb-2">1. Start Quests</h3>
              <p className="text-sm text-muted-foreground">
                Choose from various environmental activities to start your eco journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="font-medium mb-2">2. Complete Actions</h3>
              <p className="text-sm text-muted-foreground">
                Perform real-world eco-friendly activities like recycling or proper waste disposal.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-medium mb-2">3. Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get eco coins for each completed quest. 10 coins = Rp. 5,000 discount on products.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 