"use client";

import React from "react";
import Link from "next/link";
import { useQuests } from "@/contexts/QuestContext";
import { useAuth } from "@/contexts/AuthContext";
import Container from "./Container";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Leaf, Recycle, Trash2, ShoppingBag, Calendar } from "lucide-react";

const QuestPreview = () => {
  const { quests } = useQuests();
  const { isAuthenticated } = useAuth();
  
  // Get a few quests to preview
  const previewQuests = quests.slice(0, 3);
  
  return (
    <div className="medieval-section bg-primary/5">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="medieval-heading">
              Eco <span className="text-primary">Quests</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Complete quests, earn coins, and save on your next purchase
            </p>
          </div>
          
          <Link href="/quests">
            <Button className="medieval-button rounded-md">
              View All Quests
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isAuthenticated ? (
            previewQuests.length > 0 ? (
              previewQuests.map(quest => (
                <Card key={quest.id} className="medieval-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {quest.type === 'recycle' && <Recycle className="h-5 w-5 text-primary" />}
                      {quest.type === 'dispose' && <Trash2 className="h-5 w-5 text-secondary" />}
                      {quest.type === 'purchase' && <ShoppingBag className="h-5 w-5 text-accent" />}
                      {quest.type === 'daily' && <Calendar className="h-5 w-5 text-primary" />}
                      {quest.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {quest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <span>🪙</span>
                        <span>{quest.coinReward} coins</span>
                      </div>
                      
                      {quest.completed ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <Leaf className="h-4 w-4" /> Completed
                        </span>
                      ) : quest.requiredAmount ? (
                        <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                          {quest.currentAmount || 0}/{quest.requiredAmount}
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" className="rounded-md">
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No quests available at the moment.</p>
              </div>
            )
          ) : (
            <>
              <Card className="medieval-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Recycle className="h-5 w-5 text-primary" /> Recycle Plastic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recycle 3 plastic items and earn coins as a reward.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <span>🪙</span>
                      <span>10 coins</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-md" disabled>
                      Login to Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="medieval-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-secondary" /> Dispose Waste Properly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Dispose of waste in the correct bin and earn coins.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <span>🪙</span>
                      <span>5 coins</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-md" disabled>
                      Login to Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="medieval-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-accent" /> Purchase Eco-Friendly Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Buy an eco-friendly product from our store and earn coins.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <span>🪙</span>
                      <span>20 coins</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-md" disabled>
                      Login to Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        <div className="mt-8 medieval-card p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              💰
            </div> 
            How to Use Coins
          </h3>
          <p className="text-muted-foreground">
            For every 10 coins you earn, you get ₹5,000 off your next purchase. 
            Complete quests, earn coins, and save money while helping the environment!
          </p>
        </div>
      </Container>
    </div>
  );
};

export default QuestPreview;