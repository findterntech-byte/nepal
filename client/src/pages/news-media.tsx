import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  channelType: string;
  businessName: string;
  channelName?: string;
  language?: string;
  contactPhone: string;
  website?: string;
  city: string;
  state?: string;
  newspaper?: boolean;
  magazine?: boolean;
  tvChannel?: boolean;
  radioChannel?: boolean;
  youtubeChannel?: boolean;
  podcast?: boolean;
  newsPortal?: boolean;
  subscribers?: number;
  viewership?: number;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
}

export default function NewsMediaPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["news-media-public"],
    queryFn: async () => {
      const res = await fetch("/api/news-media");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = !searchQuery || 
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.channelName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || service.channelType === selectedType;
      const matchesLanguage = selectedLanguage === "all" || service.language === selectedLanguage;
      return matchesSearch && matchesType && matchesLanguage && service.isActive;
    });
  }, [services, searchQuery, selectedType, selectedLanguage]);

  const languages = useMemo(() => [...new Set(services.filter(s => s.language).map(s => s.language))], [services]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">News & Media</h1>
          <p className="text-muted-foreground">Find newspapers, TV channels, magazines, and digital media</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input placeholder="Search news channels, publications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="md:w-1/3" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="md:w-1/4"><SelectValue placeholder="Channel Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Newspaper">Newspaper</SelectItem>
              <SelectItem value="Magazine">Magazine</SelectItem>
              <SelectItem value="TV Channel">TV Channel</SelectItem>
              <SelectItem value="Radio Channel">Radio Channel</SelectItem>
              <SelectItem value="News Portal">News Portal</SelectItem>
              <SelectItem value="YouTube Channel">YouTube Channel</SelectItem>
              <SelectItem value="Podcast">Podcast</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="md:w-1/4"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (<SelectItem key={lang} value={lang}>{lang}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12">Loading...</div> : filteredServices.length === 0 ? <div className="text-center py-12 text-muted-foreground">No channels found</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation(`/news-media/${service.id}`)}>
                {service.images?.length ? <div className="h-48 overflow-hidden"><img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" /></div> : <div className="h-48 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center"><span className="text-white text-4xl">📰</span></div>}
                <CardHeader>
                  <div className="flex justify-between items-start"><CardTitle className="text-lg">{service.title}</CardTitle>{service.isFeatured && <Badge variant="secondary">Featured</Badge>}</div>
                  <p className="text-sm text-muted-foreground">{service.channelName || service.businessName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Type:</strong> {service.channelType}</p>
                    <p><strong>Language:</strong> {service.language}</p>
                    <p><strong>Location:</strong> {service.city}, {service.state}</p>
                    {service.subscribers && <p><strong>Subscribers:</strong> {service.subscribers.toLocaleString()}</p>}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.newspaper && <Badge variant="outline">Newspaper</Badge>}
                    {service.tvChannel && <Badge variant="outline">TV</Badge>}
                    {service.radioChannel && <Badge variant="outline">Radio</Badge>}
                    {service.youtubeChannel && <Badge variant="outline">YouTube</Badge>}
                    {service.podcast && <Badge variant="outline">Podcast</Badge>}
                    {service.newsPortal && <Badge variant="outline">Online</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}