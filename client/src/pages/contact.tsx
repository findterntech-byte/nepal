
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState({ city: '', state: '' });

  useEffect(() => {
    // Simulate fetching location data
    const fetchLocation = async () => {
      // In a real app, you would fetch this from an API
      const mockLocation = { city: 'Janakpur', state: 'India' };
      setLocation(mockLocation);
    };

    fetchLocation();
  }, []);

  const { data: sliders = [], isLoading: slidersLoading } = useQuery({
    queryKey: ["sliders", "Contact"],
    queryFn: async () => {
      const res = await fetch("/api/sliders?pageType=Contact");
      if (!res.ok) throw new Error("Failed to fetch sliders");
      return res.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(err?.message || 'Failed to send message');
      }

      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Contact submit error', error);
      toast({
        title: 'Failed to send message',
        description: error?.message || 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-contact">
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
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Office Information */}
              <Card data-testid="office-info">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>मुख्य कार्यालय | Head Office</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Jeevika Services Pvt. Ltd.</h4>
                    <p className="text-muted-foreground">
                    {location.city}, {location.state}<br />
 Nepal
                  </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <div>
                      <a href="tel:+9779705132820" className="hover:text-primary">+977 9705132820</a><br />
                      <a href="tel:+9779709142561" className="hover:text-primary">+977 9709142561</a><br />
                      <a href="tel:+9779810274988" className="hover:text-primary">+977 9810274988</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <div>
                      <a href="mailto:jeevika7076@gmail.com" className="hover:text-primary">jeevika7076@gmail.com</a><br />
                      <a href="mailto:support@jeevika.services" className="hover:text-primary">support@jeevika.services</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p>Monday - Friday: 6:20 PM onwards</p>
                      <p>Available for queries and support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get in Touch */}
              <Card data-testid="branch-offices">
                <CardHeader>
                  <CardTitle>सम्पर्क विधि | Connect With Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">सहयोग र साझेदारी</h4>
                    <p className="text-muted-foreground text-sm">
                      किसिम का सहयोग, साझेदारी वा व्यावसायिक प्रस्तावक को लागि सम्पर्क गर्नुहोस्।
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">ग्राहक सेवा</h4>
                    <p className="text-muted-foreground text-sm">
                      कुनै पनि समस्या वा प्रश्नक को लागि हाम्रो ग्राहक सेवा टिम सधैं तत्पर छ।
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card data-testid="quick-links">
                <CardHeader>
                  <CardTitle>तुरुन्त सम्पर्क | Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="tel:+9779705132820" className="block">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-call-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call: +977 9705132820
                    </Button>
                  </a>
                  <a href="tel:+9779709142561" className="block">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-call-2">
                      <Phone className="w-4 h-4 mr-2" />
                      Call: +977 9709142561
                    </Button>
                  </a>
                  <a href="tel:+9779810274988" className="block">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-call-3">
                      <Phone className="w-4 h-4 mr-2" />
                      Call: +977 9810274988
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card data-testid="contact-form">
              <CardHeader>
                <CardTitle className="text-2xl">
                  सन्देश पठाउनुहोस् | Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  तपाईंको कुनै प्रश्न वा सुझाव छ? हामीलाई सन्देश पठाउनुहोस्।
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">नाम | Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">इमेल | Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">फोन नम्बर | Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+977-9812345678"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">विषय | Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        data-testid="input-subject"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">सन्देश | Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message here..."
                      className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      "पठाउँदै... | Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        सन्देश पठाउनुहोस् | Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card className="mt-8" data-testid="map-section">
              <CardHeader>
                <CardTitle>हाम्रो स्थान | Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden h-64 border">
                  <iframe
                    title={`${location.city}, ${location.state}, Nepal`}
                    src={`https://www.google.com/maps?q=${location.city}%2C%20${location.state}%2C%20Nepal&z=13&output=embed`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    {location.city}, {location.state}, Nepal
                  </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card data-testid="contact-faq">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                बारम्बार सोधिने प्रश्नहरू | Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">How can I list my property?</h4>
                  <p className="text-muted-foreground text-sm">
                    You can list your property by contacting us directly or using our online form. Our team will guide you through the process.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What areas do you cover?</h4>
                  <p className="text-muted-foreground text-sm">
                    We cover major cities across Nepal including Kathmandu, Pokhara, Chitwan, Butwal, and surrounding areas.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you charge consultation fees?</h4>
                  <p className="text-muted-foreground text-sm">
                    Initial consultation is free. We charge commission only when a successful transaction is completed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How long does property verification take?</h4>
                  <p className="text-muted-foreground text-sm">
                    Property verification typically takes 3-5 business days depending on the location and documentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Back to Top Button */}
      <button
        className="fixed bottom-6 right-20 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        data-testid="button-back-to-top"
      >
        ↑
      </button>
    </div>
  );
}
