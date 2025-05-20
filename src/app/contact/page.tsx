"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };
  
  return (
    <div className="py-12">
      <Container>
        <h1 className="medieval-heading mb-6 text-center">
          <span className="text-primary">Contact</span> the Guild
        </h1>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">          Send a message to our environmental knights. We&apos;ll respond to your queries about our eco-friendly IoT devices and quests.        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <Card className="medieval-card overflow-hidden mb-6">
              <div className="h-40 relative">
                <Image
                  src="/images/castle-banner.jpg"
                  alt="Medieval Castle"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.backgroundColor = "rgba(124, 77, 255, 0.2)";
                    target.style.objectFit = "contain";
                    target.src = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z%27/%3E%3Cpath d=%27M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4%27/%3E%3Cpath d=%27M12 12h.01%27/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center border-b border-primary/20 pb-2">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Our Castle
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <a href="mailto:info@e-nvironment.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        info@e-nvironment.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <a href="tel:+6281234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        +62 812 3456 7890
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Visit Us</p>
                      <p className="text-sm text-muted-foreground">
                        Castle E-Nvironment<br />
                        Jl. Eco Tech No. 123<br />
                        Jakarta, Indonesia
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="medieval-card bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center border-b border-primary/20 pb-2">
                  <Send className="h-5 w-5 mr-2 text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="medieval-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Send a Message</CardTitle>
                <CardDescription className="text-center">
                  Fill out the form below and our eco knights will respond shortly
                </CardDescription>
              </CardHeader>
              
              {!isSubmitted ? (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="Sir Lancelot"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-md"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="lancelot@camelot.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Question about IoT devices"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        placeholder="I am interested in your smart waste management solutions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="medieval-button rounded-md w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              ) : (
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting us. Our eco knights will get back to you soon.
                  </p>
                  <Button 
                    variant="outline" 
                    className="rounded-md"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </CardContent>
              )}
              
              <CardFooter className="bg-primary/5 p-4 text-center text-sm text-muted-foreground">
                By sending this message, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-12">
          <Card className="medieval-card overflow-hidden">
            <div className="h-96 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Map loading...</p>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4527038115292!2d106.82497395042568!3d-6.202468495498983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14efd9abf05%3A0x1659a2c89e754c22!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1639132410093!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="z-10 relative"
              ></iframe>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
} 