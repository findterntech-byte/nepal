import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      toast({
        title: "Success!",
        description: "You have been subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe to newsletter. Please try again.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground" data-testid="footer">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-primary-foreground/10 rounded-xl p-8 mb-12" data-testid="newsletter-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2" data-testid="text-advertise-title">
                Want to advertise on Jeevika Services?
              </h3>
              <p className="text-primary-foreground/80 mb-4" data-testid="text-advertise-description">
                Connecting Nepal with quality services.{" "}
                <span className="text-accent underline cursor-pointer">Advertise with us</span>
              </p>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2" data-testid="text-newsletter-title">
                  Subscribe to our newsletter to get the latest updates
                </h4>
                <form onSubmit={handleNewsletterSubscribe} className="flex space-x-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-foreground bg-white"
                    data-testid="input-newsletter-email"
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-newsletter-subscribe"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-4" data-testid="text-mobile-app-title">
                  Our Mobile App
                </h4>
                <div className="space-y-3">
                  <a href="#" className="block" data-testid="link-google-play">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-12 mx-auto lg:ml-auto lg:mr-0"
                    />
                  </a>
                  <a href="#" className="block" data-testid="link-app-store">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="h-12 mx-auto lg:ml-auto lg:mr-0"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Explore Section */}
          <div data-testid="footer-explore">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {(categories || [])
                .filter((c: any) => c?.isActive !== false)
                .flatMap((c: any) => Array.isArray(c?.subcategories) ? c.subcategories : [])
                .filter((s: any) => s?.isActive !== false)
                .slice(0, 12)
                .map((s: any) => (
                  <li key={String(s.id)}>
                    <Link
                      href={`/subcategory/${encodeURIComponent(String(s.slug || s.name || s.id))}`}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline"
                    >
                      {String(s.name || 'Subcategory')}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div data-testid="footer-pages">
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Brand */}
          <div data-testid="footer-brand">
            <div className="mb-6">
              <div className="text-2xl font-bold flex items-center space-x-3" data-testid="text-footer-logo">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-black text-xl">
                  j
                </div>
                <div>
                  <span className="text-white text-xl tracking-wide">JEEVIKA</span>
                  <div className="text-xs text-accent/90 -mt-1 font-medium">सेवा प्रा. लि. | Services Pvt. Ltd.</div>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-2">नेपाललाई सेवासँग जोड्दै | Connecting Nepal with Services</p>
            </div>

            <div>
              <div className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 p-5" data-testid="footer-company-details">
                <div className="text-sm text-primary-foreground/90 font-semibold">
                  Registration No:- 372182/82/83
                </div>
                <div className="mt-3 space-y-2 text-sm text-primary-foreground/80">
                  <div className="font-medium text-primary-foreground">Jeevika Services Pvt. Ltd.</div>
                  <div>Founder &amp; CEO: Rajaul Khan</div>
                  <div>Nepal</div>
                  <div>
                    Email:{" "}
                    <a
                      href="mailto:support@jeevika.services"
                      className="underline underline-offset-4 hover:text-primary-foreground"
                    >
                      support@jeevika.services
                    </a>
                  </div>
                  <div className="pt-2 text-xs text-primary-foreground/70">
                    नेपाललाई सेवासँग जोड्दै | Connecting Nepal with Services
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-primary-foreground/60" data-testid="text-copyright">
            Copyright © 2026 Jeevika Services Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}