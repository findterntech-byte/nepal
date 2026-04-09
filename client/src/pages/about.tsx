import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function About() {
  const { data: sliders = [], isLoading: slidersLoading } = useQuery({
    queryKey: ["sliders", "About"],
    queryFn: async () => {
      const res = await fetch("/api/sliders?pageType=About");
      if (!res.ok) throw new Error("Failed to fetch sliders");
      return res.json();
    },
  });
  return (
    <div className="min-h-screen bg-background" data-testid="page-about">
      <Header />

 

      {/* Sliders */}
      {!slidersLoading && sliders.length > 0 && (
        <section className="container mx-auto px-0 py-0">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {sliders.map((s: any) => (
                <CarouselItem key={s.id}>
                  <div className="relative h-[400px] rounded-3xl overflow-hidden bg-black/5">
                    <img src={s.imageUrl} alt={s.title || "slider"} className="w-full h-full " />
                    {(s.title || s.description || s.buttonText) && (
                      <div className="absolute inset-0 flex items-end">
                        <div className="bg-gradient-to-t from-black/60 to-transparent w-full p-8">
                          <h3 className="text-3xl font-bold text-white">{s.title}</h3>
                          {s.description && <p className="text-white/90 mt-2">{s.description}</p>}
                          {s.linkUrl && s.buttonText && (
                            <div className="mt-4">
                              <a href={s.linkUrl} className="inline-block bg-white text-black px-4 py-2 rounded-md">
                                {s.buttonText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Jeevika is a comprehensive online platform designed to connect Nepal with trusted services and marketplaces. 
                  Our vision is to bring buyers, sellers, and service providers together under one trusted digital roof, making 
                  transactions simple, transparent, and accessible across the country.
                </p>
                <p>
                  Jeevika was created with a mission to strengthen the connection between people and services in Nepal through 
                  innovation, technology, and a user-focused approach. We aim to simplify the buying and selling process while 
                  creating opportunities for businesses, professionals, and skilled workers to reach a wider audience.
                </p>
                <p>
                  Our platform offers a diverse marketplace covering real estate, vehicles, electronics, furniture, fashion, 
                  household services, health & wellness, education, legal & financial services, and much more. We also proudly 
                  connect users with engineers, medical professionals, IT experts, and skilled workers, enabling direct access 
                  to professional expertise when and where it is needed.
                </p>
                <p>
                  At Jeevika, we are continuously evolving to meet the changing needs of our users. By providing the right tools, 
                  resources, and digital connections, we support individuals and businesses in growing together. Whether you are 
                  buying, selling, or searching for reliable professional services, Jeevika is your trusted partner in connecting 
                  Nepal with services—efficiently, securely, and affordably.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to connect Nepal with trusted services and digital marketplaces, empowering people, businesses, 
                  and professionals through transparent, affordable, and technology-driven solutions.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our vision is to become Nepal's most trusted digital services ecosystem, empowering communities, businesses, 
                  and professionals through innovation, accessibility, and nationwide digital inclusion.
                </p>
              </CardContent>
            </Card>

            {/* Story */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Jeevika Services Pvt. Ltd. was born from a simple yet powerful idea—to connect Nepal with trusted services 
                  through one digital platform. In a country rich with talent, businesses, and skilled professionals, access 
                  to the right opportunities and reliable services was often scattered and limited.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground"><strong>Integrity</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground"><strong>Customer Trust</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground"><strong>Innovation</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground"><strong>Community Empowerment</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            {/* Leadership */}
            <Card>
              <CardHeader>
                <CardTitle>Leadership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Mr. Rajaul Khan</h4>
                  <p className="text-sm text-muted-foreground">CEO & Founder</p>
                </div>
                <div>
                  <h4 className="font-semibold">Mr. Salman Khan</h4>
                  <p className="text-sm text-muted-foreground">General Manager</p>
                </div>
                <div>
                  <h4 className="font-semibold">Mr. Prem Panday</h4>
                  <p className="text-sm text-muted-foreground">Manager</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href="tel:+9779705132820" className="text-sm text-primary hover:underline">
                      +977 9705132820
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <a href="mailto:jeevikaservices56@gmail.com" className="text-sm text-primary hover:underline block">
                        jeevikaservices56@gmail.com
                      </a>
                      <a href="mailto:jeevika7076@gmail.com" className="text-sm text-primary hover:underline block">
                        jeevika7076@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2"><strong>Customer Care:</strong></p>
                  <a href="mailto:support@jeevika.services" className="text-sm text-primary hover:underline">
                    support@jeevika.services
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/signup">Create an Account</a>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
