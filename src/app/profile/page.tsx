"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Leaf,
  Recycle
} from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  items: OrderItem[];
  total: number;
};

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { userCoins, completedQuests, activeQuests } = useQuests();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>("10");

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);
  
  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [searchParams]);
  
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orderHistory');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders([]);
      }
    };

    // Initial load
    loadOrders();

    // Reload on window focus
    const handleFocus = () => loadOrders();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Reload orders whenever the active tab switches to 'orders'
  useEffect(() => {
    if (activeTab === 'orders') {
      const storedOrders = localStorage.getItem('orderHistory');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    }
  }, [activeTab]);
  
  // Handle authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  // If not authenticated and we're in the first render, return a loading state
  if (!isAuthenticated) {
    return (
      <div className="py-12">
        <Container>
          <div className="text-center">
            <h1 className="medieval-heading mb-4">Loading...</h1>
          </div>
        </Container>
      </div>
    );
  }
  
  const handleUpdateProfile = () => {
    setLoading(true);
    
    updateProfile({ name, email });
    
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
    }, 500);
  };
  
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  const handleTopup = () => {
    alert(`Successfully topped up Rp. ${parseInt(topupAmount) * 10000}`);
  };

  const handleChangePassword = () => {
    setPasswordLoading(true);
    console.log({ currentPassword, newPassword, confirmPassword });

    if(newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      setPasswordLoading(false);
      return;
    }

    setTimeout(() => {
      setPasswordLoading(false);
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    }, 1000);
  }
  
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="text-lg">{user?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                        <p className="text-lg">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleUpdateProfile} className="w-full medieval-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
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
                <CardTitle>Your Order History</CardTitle>
                <CardDescription>Review your past enchantments and artifacts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="medieval-card p-4 bg-background/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg" style={{ fontFamily: "var(--font-medieval)" }}>
                            Order #{order.id.split('-')[1]}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span 
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' : 
                            order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="border-t border-border my-3"></div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <p>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                            <p>{item.price * item.quantity} Coins</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border my-3"></div>
                      <div className="flex justify-end">
                        <p className="font-bold text-lg">Total: {order.total} Coins</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-4">You haven&apos;t made any purchases yet. Start shopping for eco-friendly products!</p>
                    <Link href="/shop">
                      <Button className="medieval-button rounded-md">
                        Browse the Royal Bazaar
                      </Button>
                    </Link>
                  </div>
                )}
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
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={!isEditingPassword}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isEditingPassword}
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isEditingPassword}
                    className="rounded-md"
                  />
                </div>
              </CardContent>
              <CardFooter>
                {isEditingPassword ? (
                  <div className="flex gap-2 w-full">
                    <Button onClick={handleChangePassword} className="w-full medieval-button" disabled={passwordLoading}>
                      {passwordLoading ? 'Saving...' : 'Save Password'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingPassword(false)} className="w-full">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setIsEditingPassword(true)}>
                    Change Password
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
} 