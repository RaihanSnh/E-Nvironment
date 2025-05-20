"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, Recycle, ShieldCheck, Users, Scroll, Crown, Castle } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sir Alex Johnson",
      role: "Guild Master & Royal Advisor",
      image: "/images/team1.jpg",
      bio: "Former environmental scholar with a passion for technology and sustainability."
    },
    {
      name: "Lady Sophia Chen",
      role: "Master Artificer",
      image: "/images/team2.jpg",
      bio: "IoT magician with over 10 years of experience in smart device enchantment."
    },
    {
      name: "Lord Marcus Rivera",
      role: "Royal Artisan",
      image: "/images/team3.jpg",
      bio: "User experience craftsman focused on creating intuitive environmental artifacts."
    },
    {
      name: "Lady Emma Wong",
      role: "Guardian of the Realm",
      image: "/images/team4.jpg",
      bio: "Environmental sage ensuring all our creations meet the highest ecological standards."
    }
  ];
  
  const statistics = [
    { value: "2.5M+", label: "Kg of Carbon Banished", icon: <Leaf className="h-6 w-6 text-primary" /> },
    { value: "50K+", label: "Eco Quests Fulfilled", icon: <Recycle className="h-6 w-6 text-secondary" /> },
    { value: "15K+", label: "Loyal Subjects", icon: <Users className="h-6 w-6 text-accent" /> },
    { value: "100+", label: "Enchanted Artifacts", icon: <ShieldCheck className="h-6 w-6 text-primary" /> }
  ];
  
  return (
    <div>
      <div className="medieval-divider"></div>
      
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 z-0"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-primary mr-3" />
              <h1 className="medieval-heading">
                The <span className="text-primary">Royal Decree</span> of E-Nvironment
              </h1>
            </div>
            <div className="medieval-quote mb-8">
              &quot;In this kingdom, we forge technology with nature&apos;s wisdom, creating harmony between progress and preservation.&quot;
            </div>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground" style={{ fontFamily: "var(--font-medieval-text)" }}>
              We craft sustainable IoT enchantments that help individuals and businesses monitor, conserve, and protect our realm&apos;s resources. Our quest is to make environmental stewardship accessible to all citizens of the kingdom.
            </p>
          </div>
        </Container>
      </div>
      
      {/* Our Story */}
      <div className="medieval-section">
        <Container className="py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="medieval-heading text-2xl md:text-3xl mb-6 flex items-center">
                <Scroll className="h-6 w-6 text-primary mr-3" />
                The Chronicles of Our Guild
              </h2>
              <div className="space-y-4" style={{ fontFamily: "var(--font-medieval-text)" }}>
                <p>
                  E-Nvironment was founded in the year of 2020 by a fellowship of environmental scholars and technology enchanters who saw the mystical potential of IoT artifacts to make a positive impact on our realm.
                </p>
                <p>
                  What began as a humble quest to create smart waste monitoring artifacts has evolved into a vast network offering a range of environmental enchantments for homes and guildhalls across the land.
                </p>
                <p>
                  Today, we stand proudly at the vanguard of sustainable wizardry, combining cutting-edge IoT incantations with legendary quests to encourage environmentally responsible deeds among citizens of all kingdoms.
                </p>
              </div>
            </div>
            <div className="medieval-card overflow-hidden h-80 relative">
              <Image
                src="/images/team-meeting.jpg"
                alt="Council meeting discussing environmental solutions"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
      
      {/* Our Impact */}
      <div className="medieval-section bg-primary/5">
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="medieval-heading text-2xl md:text-3xl inline-block">
              The <span className="text-primary">Legends</span> of Our Impact
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <Card key={index} className="medieval-card text-center h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-medieval)" }}>
                    {stat.value}
                  </div>
                  <p className="text-sm" style={{ fontFamily: "var(--font-medieval-text)" }}>
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="medieval-quote max-w-2xl mx-auto mb-6">
              Every artifact purchased and eco quest completed strengthens our enchantment on the world, creating a more sustainable future for all kingdoms.
            </div>
            <Link href="/quests">
              <Button className="medieval-button rounded-md px-6 py-3 text-base">
                Join Our Knightly Quests <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </div>
      
      {/* Our Team */}
      <div className="medieval-section">
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="medieval-heading text-2xl md:text-3xl inline-block">
              The <span className="text-primary">Noble</span> Council
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="medieval-card overflow-hidden">
                <div className="relative h-60 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-medieval)" }}>{member.name}</h3>
                  <p className="text-sm text-primary mb-2" style={{ fontFamily: "var(--font-medieval-text)" }}>{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>
      
      {/* Values */}
      <div className="medieval-section bg-primary/5">
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="medieval-heading text-2xl md:text-3xl inline-block">
              The <span className="text-primary">Code</span> of Honor
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="medieval-card p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "var(--font-medieval)" }}>Sustainability</h3>
              <p className="text-muted-foreground text-center" style={{ fontFamily: "var(--font-medieval-text)" }}>
                Every enchantment we forge is designed with environmental harmony at its core, from materials to energy efficiency.
              </p>
            </div>
            
            <div className="medieval-card p-6">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "var(--font-medieval)" }}>Fellowship</h3>
              <p className="text-muted-foreground text-center" style={{ fontFamily: "var(--font-medieval-text)" }}>
                We believe in the power of united realms, which is why we&apos;ve built legendary quests and royal rewards into our covenant.
              </p>
            </div>
            
            <div className="medieval-card p-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <ShieldCheck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "var(--font-medieval)" }}>Truth</h3>
              <p className="text-muted-foreground text-center" style={{ fontFamily: "var(--font-medieval-text)" }}>
                We pledge to be forthright about our artifacts&apos; environmental influence and the tangible difference they make in the kingdom.
              </p>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Call to Action */}
      <div className="medieval-section">
        <Container className="py-16">
          <Card className="medieval-card p-8 md:p-12 bg-primary/10 text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <Castle className="h-12 w-12 text-primary" />
            </div>
            <h2 className="medieval-heading text-2xl md:text-3xl mb-6 inline-block">
              Join the Environmental Crusade
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-medieval-text)" }}>
              Whether you seek to reduce your carbon footprint with our enchanted devices or wish to embark on environmental quests, our guild welcomes you to make a difference in the realm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="medieval-button rounded-md w-full sm:w-auto px-6 py-3 text-base">
                  Browse the Royal Bazaar
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-md w-full sm:w-auto px-6 py-3 text-base" style={{ fontFamily: "var(--font-medieval)" }}>
                  Send a Scroll to Our Guild
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
      
      <div className="medieval-divider"></div>
    </div>
  );
} 