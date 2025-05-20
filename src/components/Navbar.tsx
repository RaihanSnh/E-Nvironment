"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "./Container";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Sun, Moon, ShoppingCart, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const scrollHandler = () => {
    if (window.scrollY > 100) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolling ? 'py-0 shadow-md' : 'py-2'}`}>
      <div className={`${scrolling ? 'bg-card/95' : 'bg-card/80'} backdrop-blur-md transition-all duration-300`}>
        <Container>
          <div className="flex justify-between items-center py-3 px-4">
            <Link href="/" className="flex items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                E
              </div>
              <span className="font-bold text-lg tracking-wider">E-NVIRONMENT</span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 font-medium">
              <li><NavLink href="/">Home</NavLink></li>
              <li><NavLink href="/shop">Shop</NavLink></li>
              <li><NavLink href="/quests">Quests</NavLink></li>
              <li><NavLink href="/about">About</NavLink></li>
              <li><NavLink href="/contact">Contact</NavLink></li>
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-3 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="rounded-md"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-md relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link href="/profile">
                  <Button 
                    variant="default"
                    size="sm"
                    className="rounded-md medieval-button"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="default"
                    size="sm"
                    className="rounded-md medieval-button"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-background/95 z-40 md:hidden backdrop-blur-sm transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Container className="pt-24 px-8">
          <ul className="flex flex-col space-y-6 text-lg font-medium">
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">Home</Link>
            </li>
            <li>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2">Shop</Link>
            </li>
            <li>
              <Link href="/quests" onClick={() => setMobileMenuOpen(false)} className="block py-2">Quests</Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2">About</Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2">Contact</Link>
            </li>
          </ul>
        </Container>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="text-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
};

export default Navbar;
