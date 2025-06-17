"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Container from "./Container";

const Hero = () => {
  return (
    <div className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 z-0"></div>
      <Container className="relative z-10">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="medieval-heading mb-6">
            <span className="torch-flicker">Forge Your Legacy</span> in an Age of
            Adventure
          </h1>
          <p
            className="text-lg md:text-xl mb-8 text-muted-foreground"
            style={{ fontFamily: "var(--font-medieval-text)" }}
          >
            Embark on noble quests, discover enchanted artifacts, and claim your
            rightful place in the kingdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="medieval-button rounded-md px-6 py-3 text-base">
                Browse The Armoury
              </Button>
            </Link>
            <Link href="/quests">
              <Button variant="outline" className="rounded-md px-6 py-3 text-base">
                Join Eco Quests
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            <div className="medieval-card p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-2xl mr-3">
                  🌱
                </div>
                <h3 className="font-semibold text-lg">Earn Eco Coins</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete environmental quests to earn coins that can be redeemed for discounts on our sustainable products.
              </p>
            </div>
            
            <div className="medieval-card p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-2xl mr-3">
                  🌍
                </div>
                <h3 className="font-semibold text-lg">Track Your Impact</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor your environmental contributions and see how your actions are helping create a greener planet.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;