"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuests } from "@/contexts/QuestContext";
import Container from "@/components/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  CreditCard, 
  History, 
  Medal, 
  Settings, 
  LogOut,
  PlusCircle,
  ArrowRight,
  Leaf,
  Recycle 
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { userCoins, completedQuests, activeQuests } = useQuests();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>("10");
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }
  
  const handleUpdateProfile = () => {
    setLoading(true);
    
    // Call the update profile function
    updateProfile({ name, email });
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  // Handle top-up functionality
  const handleTopup = () => {
    alert(`Successfully topped up Rp. ${parseInt(topupAmount) * 10000}`);
  };
  
  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="medieval-heading">
              Welcome, <span className="text-primary">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground">Manage your account and eco-impact</p>
          </div>
          
          <div className="flex gap-4">
            <div className="medieval-card px-4 py-2 flex items-center gap-2">
              <span className="text-primary font-medium">🪙</span>
              <span className="font-semibold">{userCoins} Eco Coins</span>
            </div>
            
            <Button 
              variant="outline" 
              className="rounded-md flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-xl rounded-md">
            <TabsTrigger value="overview" className="rounded-none">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="rounded-none">
              <Medal className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none">
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-none">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="medieval-card">
                <CardHeader>
                  <CardTitle>Eco Impact</CardTitle>
                  <CardDescription>Your environmental contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="medieval-card p-4 flex items-center gap-4 bg-primary/10">
                      <Leaf className="h-12 w-12 text-primary" />
                      <div>
                        <p className="font-semibold text-lg">{completedQuests.length} Activities Completed</p>
                        <p className="text-sm text-muted-foreground">Eco-friendly actions taken</p>
                      </div>
                    </div>
                    
                    <div className="medieval-card p-4 flex items-center gap-4 bg-secondary/10">
                      <Recycle className="h-12 w-12 text-secondary" />
                      <div>
                        <p className="font-semibold text-lg">{userCoins} Eco Coins Earned</p>
                        <p className="text-sm text-muted-foreground">Redeem for discounts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="medieval-button rounded-md w-full"
                    onClick={() => router.push("/quests")}
                  >
                    Start New Quest
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="medieval-card md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Name</p>
                      <p>{user?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p>{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Member Since</p>
                      <p>{user?.createdAt?.toLocaleDateString() || new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-md"
                    onClick={() => router.push("/profile/settings")}
                  >
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="medieval-card lg:col-span-1">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest eco actions</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedQuests.slice(0, 3).map((quest, index) => (
                    <div key={index} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {quest.type === 'recycle' && <Recycle className="h-4 w-4 text-primary" />}
                        {quest.type === 'dispose' && <Leaf className="h-4 w-4 text-secondary" />}
                      </div>
                      <div>
                        <p className="font-medium">{quest.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()} • {quest.coinReward} coins
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {completedQuests.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No activities yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-md flex items-center justify-center gap-2"
                    onClick={() => router.push("/profile/activities")}
                  >
                    <ArrowRight className="h-4 w-4" />
                    View All Activities
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Quests Tab */}
          <TabsContent value="quests">
            <Card className="medieval-card">
              <CardHeader>
                <CardTitle>Your Eco Quests</CardTitle>
                <CardDescription>Track your environmental impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Active Quests</h3>
                    {activeQuests.length > 0 ? (
                      <div className="space-y-3">
                        {activeQuests.map((quest, index) => (
                          <div key={index} className="medieval-card p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {quest.type === 'recycle' && <Recycle className="h-4 w-4 text-primary" />}
                                {quest.type === 'dispose' && <Leaf className="h-4 w-4 text-secondary" />}
                              </div>
                              <div>
                                <p className="font-medium">{quest.title}</p>
                                <p className="text-xs text-muted-foreground">{quest.coinReward} coins</p>
                              </div>
                            </div>
                            
                            {quest.requiredAmount ? (
                              <div className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                                {quest.currentAmount || 0}/{quest.requiredAmount}
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="rounded-md">
                                Complete
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-2">No active quests</p>
                        <Button 
                          variant="outline" 
                          className="rounded-md flex items-center gap-2"
                          onClick={() => router.push("/quests")}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Start New Quest
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Completed Quests</h3>
                    {completedQuests.length > 0 ? (
                      <div className="space-y-3">
                        {completedQuests.map((quest, index) => (
                          <div key={index} className="medieval-card p-3 flex justify-between items-center bg-primary/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {quest.type === 'recycle' && <Recycle className="h-4 w-4 text-primary" />}
                                {quest.type === 'dispose' && <Leaf className="h-4 w-4 text-secondary" />}
                              </div>
                              <div>
                                <p className="font-medium">{quest.title}</p>
                                <p className="text-xs text-muted-foreground">Completed on {new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="text-primary font-medium flex items-center gap-1">
                              <span>+{quest.coinReward}</span>
                              <span>🪙</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No completed quests yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="medieval-button rounded-md w-full"
                  onClick={() => router.push("/quests")}
                >
                  View All Quests
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="medieval-card">
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Track your eco-friendly purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12">
                  <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't made any purchases yet. Start shopping for eco-friendly products!
                  </p>
                  <Link href="/shop">
                    <Button className="medieval-button rounded-md">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card className="medieval-card">
              <CardHeader>
                <CardTitle>Your Wallet</CardTitle>
                <CardDescription>Manage your balance and eco coins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="medieval-card p-4 bg-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-2xl font-bold">Rp. 100,000</p>
                  </div>
                  
                  <div className="medieval-card p-4 bg-secondary/10">
                    <p className="text-sm text-muted-foreground mb-1">Eco Coins</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{userCoins}</p>
                      <span className="text-primary text-sm">🪙</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      10 coins = Rp. 5,000 discount
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h3 className="font-medium mb-3">Top Up Balance</h3>
                  <div className="flex gap-3 mb-4">
                    {["10", "50", "100", "200"].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        className={`rounded-md flex-1 ${topupAmount === amount ? 'bg-primary/20' : ''}`}
                        onClick={() => setTopupAmount(amount)}
                      >
                        Rp. {parseInt(amount) * 10000}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    className="medieval-button rounded-md w-full"
                    onClick={handleTopup}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Top Up Rp. {parseInt(topupAmount) * 10000}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="medieval-card">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled
                    className="rounded-md"
                  />
                  <div className="text-right">
                    <Button 
                      variant="link" 
                      className="text-primary h-auto p-0"
                      onClick={() => router.push("/profile/change-password")}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  className="rounded-md"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
                
                <Button 
                  className="medieval-button rounded-md"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
} 