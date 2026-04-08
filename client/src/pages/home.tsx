import { useState, useRef, useEffect } from "react";

import {
  Home as HomeIcon,
  Building,
  Globe,
  Bus,
  Users,
  GraduationCap,
  List,
  Map,
  Building2,
  MapPin,
  Briefcase,
  Settings,
  Laptop,
  Smartphone,
  Shirt,
  Sofa,
  Car,
  BookOpen,
  Monitor,
  Sparkles,
  Home as House,
  BookMarked,
  Dumbbell,
  Languages,
  Music,
  Award,
  School,
  Trophy,
  Globe2,
  Brain,
  Truck,
  Star,
  TrendingUp,
  Shield,
  Clock,
  User,
  ArrowRight,
  Download,
  Eye,
  Badge as BadgeIcon
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import SearchFilters from "@/components/search-filters";
import FeaturedBanner from "@/components/featured-banner";
import StatsSection from "@/components/stats-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import MarketplaceDisclaimerBanner from "@/components/marketplace-disclaimer-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Property } from "@shared/schema";
import type { SearchFilters as SearchFiltersType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const buildCategoryItemHref = (categoryLabel: string, id: string) => `/${encodeURIComponent(categoryLabel)}/${id}`;

const iconMap: Record<string, any> = {
  'home': HomeIcon,
  'building': Building,
  'building2': Building2,
  'globe': Globe,
  'bus': Bus,
  'users': Users,
  'graduation-cap': GraduationCap,
  'list': List,
  'map': Map,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'smartphone': Smartphone,
  'shirt': Shirt,
  'sofa': Sofa,
  'car': Car,
  'book-open': BookOpen,
  'monitor': Monitor,
  'sparkles': Sparkles,
  'house': House,
  'book-marked': BookMarked,
  'dumbbell': Dumbbell,
  'languages': Languages,
  'music': Music,
  'award': Award,
  'school': School,
  'trophy': Trophy,
  'globe2': Globe2,
  'brain': Brain,
  'truck': Truck,
  'badge': BadgeIcon,
};

// Neutral fallback icon component using lucide `Badge` for consistent visuals
const DefaultIcon = ({ className = '' }: { className?: string }) => (
  <BadgeIcon className={`${className} text-gray-400`} />
);

// Resolve icon from various possible data values (normalize strings)
function getIconByName(name?: string): any | null {
  if (!name || typeof name !== 'string') return null;
  const raw = name.trim();
  const candidates = new Set<string>();
  candidates.add(raw);
  candidates.add(raw.toLowerCase());
  candidates.add(raw.replace(/[_\s]+/g, '-').toLowerCase());
  candidates.add(raw.replace(/[_\-\s]+/g, '').toLowerCase());
  candidates.add(raw.replace(/[_\s]+/g, '_').toLowerCase());

  for (const c of Array.from(candidates)) {
    if (iconMap[c]) return iconMap[c];
  }
  return null;
}

// Static mapping from normalized category slug/name to iconMap key
const categoryIconMapping: Record<string, string> = {
  'education': 'graduation-cap',
  'education-learning': 'graduation-cap',
  'education & learning': 'graduation-cap',
  'electronics': 'monitor',
  'electronics-technology': 'monitor',
  'electronics & technology': 'monitor',
  'fashion': 'shirt',
  'fashion-lifestyle': 'shirt',
  'fashion & lifestyle': 'shirt',
  'furniture': 'sofa',
  'furniture-home-decor': 'sofa',
  'furniture & home decor': 'sofa',
  'real-estate': 'building2',
  'real-estate-property': 'building2',
  'real estate & property': 'building2',
  'vehicles': 'car',
  'vehicles-transportation': 'car',
  'vehicles & transportation': 'car',
  'skilled-labour': 'briefcase',
  'skilled-labor': 'briefcase',
  'skilled labour': 'briefcase',
  'health-wellness': 'dumbbell',
  'health & wellness': 'dumbbell',
  'pharmacy-medical': 'monitor',
  'construction-materials': 'building',
  'jewelry-accessories': 'award',
  'jewellery-accessories': 'award',
  'books': 'book-open',
  'education-services': 'graduation-cap',
  // Construction / Property mappings
  'construction-building-materials': 'building',
  'construction & building materials': 'building',
  'local-market': 'building2',
  'local-market-commercial-property': 'building2',
  'commercial-property': 'building2',
  'industrial-land': 'building2',
  'factory-industrial-land': 'building2',
  'company-office-space': 'briefcase',
  'office-space': 'briefcase',
  'rental-rooms-flats-apartments': 'house',
  'rental-rooms': 'house',
  'rental-flats-apartments': 'house',
  'rental-listings': 'house',
  'hostel-pg': 'house',
  'hostels-pg': 'house',
  'property-deals': 'map-pin',
};

// Subcategory-specific icon mapping (normalized slug/name -> iconMap key)
const subcategoryIconMapping: Record<string, string> = {
  'tuition-private-classes': 'graduation-cap',
  'dance-karate-gym-yoga': 'dumbbell',
  'dance-karate-gym-yoga-classes': 'dumbbell',
  'language-classes': 'languages',
  'academies-music-arts-sports': 'music',
  'skill-training-certification': 'award',
  'schools-colleges-coaching-institutes': 'school',
  'cricket-sports-training': 'trophy',
  'ebooks-online-courses': 'book-open',
  'e-books-online-courses': 'book-open',
  'e-books-and-online-courses': 'book-open',
  'educational-consultancy-study-abroad': 'globe2',
  'educational-consultancy-study-abroad-admissions': 'globe2',
  'computer-mobile-laptop-repair-services': 'laptop',
  'cyber-cafe-internet-services': 'globe',
  'new-phones-tablets-accessories': 'smartphone',
  'electronics-gadgets': 'monitor',
  'fashion-beauty-products': 'shirt',
  'jewelry-accessories': 'award',
  'furniture-interior-decor': 'sofa',
  'cars-bikes': 'car',
  'second-hand-cars-bikes': 'car',
  'car-bike-rentals': 'car',
  'construction-materials': 'building',
  'household-services': 'briefcase',
  'health-wellness-services': 'dumbbell',
  'pharmacy-medical-stores': 'book-marked',
  'event-decoration-services': 'sparkles',
  'residential-properties': 'house',
  'heavy-equipment': 'truck',
  'heavy-equipment-for-sale': 'truck',
  'showrooms': 'building2',
  'showrooms-authorized': 'building2',
  'showrooms-second-hand': 'building2',
  'showroom': 'building2',
  'authorized-showrooms': 'building2',
  'second-hand-showrooms': 'building2',
  'secondhand-showrooms': 'building2',
  'second hand': 'building2',
  'second-hand': 'building2',
  'vehicle-license-classes': 'badge',
  'vehicle-license': 'badge',
  'vehicle-licence': 'badge',
  'vehiclelicenseclasses': 'badge',
  'vehicle license classes': 'badge',
  'vehicle license': 'badge',
  'telecommunication-services': 'globe',
  'second-hand-phones-tablets-accessories': 'smartphone',
  'second-hand-phones': 'smartphone',
  'service-centre-warranty': 'monitor',
  // Saree / clothing variants
  'saree-clothing': 'shirt',
  'saree-clothing-shopping': 'shirt',
  'sarees': 'shirt',
  'saree': 'shirt',
  'sari': 'shirt',
  // Property / construction subcategories
  'construction-building-materials': 'building',
  'local-market': 'building2',
  'local-market-commercial-property': 'building2',
  'commercial-properties': 'building2',
  'commercial-property': 'building2',
  'industrial-land': 'building2',
  'factory-industrial-land': 'building2',
  'office-spaces': 'briefcase',
  'company-office-space': 'briefcase',
  'rental-rooms-flats-apartments': 'house',
  'rental-listings': 'house',
  'rooms-flats-apartments': 'house',
  'hostel-pg': 'house',
  'hostels-pg': 'house',
  'property-deals': 'map-pin',
};

// Resolve an icon for a category/subcategory object using multiple fallbacks
function resolveIconForCategory(item?: any): any | null {
  if (!item) return null;
  // Try explicit icon field first
  const byIconField = getIconByName(item.icon);
  if (byIconField) return byIconField;

  // Try slug
  const bySlug = getIconByName(item.slug);
  if (bySlug) return bySlug;

  // Try name variants and mapping
  const name = (item.name || '').toString().trim();
  const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // direct lookup in iconMap by normalized name
  const byName = getIconByName(normalized);
  if (byName) return byName;

  // Try removing common suffixes (classes, courses, services, training, institutes, admissions)
  const suffixes = ['-classes', '-courses', '-course', '-services', '-training', '-institutes', '-admissions', '-online'];
  for (const s of suffixes) {
    if (normalized.endsWith(s)) {
      const base = normalized.slice(0, -s.length);
      if (base) {
        const byBaseName = getIconByName(base);
        if (byBaseName) return byBaseName;
        if (subcategoryIconMapping[base]) return iconMap[subcategoryIconMapping[base]] || null;
        if (categoryIconMapping[base]) return iconMap[categoryIconMapping[base]] || null;
      }
    }
  }

  // mapping lookup
  // subcategory mapping takes precedence
  if (subcategoryIconMapping[normalized]) {
    return iconMap[subcategoryIconMapping[normalized]] || null;
  }

  if (subcategoryIconMapping[name.toLowerCase()]) {
    return iconMap[subcategoryIconMapping[name.toLowerCase()]] || null;
  }

  // then category mapping
  if (categoryIconMapping[normalized]) {
    return iconMap[categoryIconMapping[normalized]] || null;
  }

  // also try the raw lowercased name for category mapping
  if (categoryIconMapping[name.toLowerCase()]) {
    return iconMap[categoryIconMapping[name.toLowerCase()]] || null;
  }

  // Keyword-based fallback for common subcategory phrases
  const lname = name.toLowerCase();
  if (lname.includes('cyber') || lname.includes('internet') || lname.includes('cafe')) {
    return iconMap['globe'] || null;
  }
  if (lname.includes('showroom') || lname.includes('showrooms') || lname.includes('authorized') || lname.includes('second-hand') || lname.includes('second hand')) {
    return iconMap['building2'] || null;
  }
  if (lname.includes('computer') || lname.includes('repair') || lname.includes('service centre') || lname.includes('service center') || lname.includes('service')) {
    return iconMap['laptop'] || null;
  }
  if (lname.includes('phone') || lname.includes('tablet')) {
    return iconMap['smartphone'] || null;
  }
  // Clothing / saree keyword fallback
  if (lname.includes('saree') || lname.includes('sari') || lname.includes('cloth') || lname.includes('clothing')) {
    return iconMap['shirt'] || null;
  }
  // Vehicle license keyword fallback
  if (lname.includes('license') || lname.includes('licence') || lname.includes('vehicle license') || lname.includes('license classes')) {
    return iconMap['badge'] || null;
  }

  return null;
}
const pastelColors = [
  "bg-purple-100 hover:bg-purple-200",
  "bg-blue-100 hover:bg-blue-200",
  "bg-green-100 hover:bg-green-200",
  "bg-yellow-100 hover:bg-yellow-200",
  "bg-pink-100 hover:bg-pink-200",
  "bg-indigo-100 hover:bg-indigo-200",
  "bg-teal-100 hover:bg-teal-200",
];

// Helper function to cast JSON properties to the Property type
function castToProperty(data: any): Property {
  return {
    ...data,
    // Explicitly cast date strings to Date objects, handle nulls
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    // Ensure numeric fields are numbers, handle potential nulls from schema
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    // Ensure price and area are parsed as numbers (or handle as per schema, assuming decimal/float for now)
    price: parseFloat(data.price) || 0,
    area: parseFloat(data.area) || 0,
    // Ensure other potentially nullable fields are handled
    locationId: data.locationId ?? null,
    categoryId: data.categoryId ?? null,
    agencyId: data.agencyId ?? null,
    furnishingStatus: data.furnishingStatus ?? "unfurnished", // Default if not present
    availabilityStatus: data.availabilityStatus ?? "available", // Default if not present
  };
}


export default function Home() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceType: "rent",
  });
  const [activeCategory, setActiveCategory] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Dev-only: log categories and resolved icon availability to help mapping
  useEffect(() => {
    try {
      if (!categories || !Array.isArray(categories)) return;
      const debug = categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        iconField: c.icon,
        subcategories: (c.subcategories || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          iconField: s.icon,
          resolved: !!resolveIconForCategory(s),
        })),
      }));
      // eslint-disable-next-line no-console
      console.debug('CATEGORIES DEBUG:', debug);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error logging categories', e);
    }
  }, [categories]);

  const { data: sliders = [], isLoading: slidersLoading } = useQuery({
    queryKey: ["sliders", "Home"],
    queryFn: async () => {
      const res = await fetch("/api/sliders?pageType=Home");
      if (!res.ok) throw new Error("Failed to fetch sliders");
      return res.json();
    },
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["blog-posts-home"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  const { data: sliderCards = [], isLoading: sliderCardsLoading } = useQuery({
    queryKey: ["slider-cards"],
    queryFn: async () => {
      const res = await fetch('/api/slider-cards');
      if (!res.ok) throw new Error('Failed to fetch slider cards');
      return res.json();
    },
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["videos", "featured"],
    queryFn: async () => {
      const res = await fetch('/api/videos?featured=true');
      if (!res.ok) throw new Error('Failed to fetch videos');
      return res.json();
    },
  });

  const { data: categoryProducts = {}, isLoading: categoryProductsLoading } = useQuery({
    queryKey: ["category-products"],
    queryFn: async () => {
      try {
        const toSlug = (value: unknown) => {
          const s = (value ?? "").toString().trim().toLowerCase();
          return s
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        };

        const safeJson = async (res: Response) => {
          const contentType = res.headers.get("content-type") || "";
          if (!contentType.toLowerCase().includes("application/json")) {
            const text = await res.text();
            throw new Error(
              `Expected JSON but received ${contentType || "unknown"}. First bytes: ${text.slice(0, 60)}`
            );
          }
          return res.json();
        };

        // Fetch all active categories
        const categoriesRes = await fetch('/api/admin/categories');
        if (!categoriesRes.ok) return {};
        const allCategories = await categoriesRes.json();
        
        const grouped: Record<string, any> = {};
        
        // Map subcategory names/slugs to their API table endpoints
        const subcategoryToTable: Record<string, string> = {
          // Education
          'tuition-private-classes': 'skill-training',
          'dance-karate-gym-yoga': 'dance-karate-gym-yoga',
          'language-classes': 'language-classes',
          'computer-mobile-laptop-repair-services': 'computer-repair',
          'academies-music-arts-sports': 'academies',
          // Electronics
          'electronics-gadgets': 'electronics-gadgets',
          'new-phones-tablets-accessories': 'phones-tablets',
          'cyber-cafe-internet-services': 'cyber-cafe',
          // Fashion
          'fashion-beauty-products': 'fashion-beauty',
          'jewelry-accessories': 'jewelry-accessories',
          'saree-clothing-shopping': 'saree-clothing',
          // Furniture
          'furniture-interior-decor': 'furniture-interior-decor',
          // Real Estate
          'residential-properties': 'properties',
          'commercial-properties': 'commercial-properties-public',
          'office-spaces': 'office-spaces-public',
          'industrial-land': 'industrial-land-public',
          'property-deals': 'property-deals-public',
          'rental-listings': 'rental-listings',
          'hostel-pg': 'hostel-listings',
          // Vehicles
          'cars-bikes': 'cars-bikes',
          'second-hand-cars-bikes': 'second-hand-cars-bikes',
          'car-bike-rentals': 'car-bike-rentals',
          // Other
          'construction-materials': 'construction-materials',
          'household-services': 'household-services',
          'health-wellness-services': 'health-wellness',
          'pharmacy-medical-stores': 'pharmacy',
          'event-decoration-services': 'event-decoration',
          'service-centre-warranty': 'service-centre',
          'showrooms': 'showrooms-public',
          'ebooks-online-courses': 'ebooks-courses',
          'educational-consultancy-study-abroad': 'educational-consultancy',
          'skill-training-certification': 'skill-training',
          'blog': 'blog',
          'second-hand-phones-tablets-accessories': 'second-hand-phones',
          'heavy-equipment': 'heavy-equipment-public',
          'transportation-moving-services': 'transportation-services',
        };

        const allowedApiTables = new Set<string>([
          'properties',
          'commercial-properties-public',
          'office-spaces-public',
          'industrial-land-public',
          'property-deals-public',
          'rental-listings',
          'hostel-listings',
          'cars-bikes',
          'second-hand-cars-bikes',
          'car-bike-rentals',
          'construction-materials',
          'heavy-equipment-public',
          'showrooms-public',
          'vehicle-license-classes',
          'transportation-services',
          'electronics-gadgets',
          'phones-tablets-accessories',
          'fashion-beauty',
          'jewelry-accessories',
          'furniture-interior-decor',
          'household-services',
          'health-wellness',
          'pharmacy',
          'event-decoration',
          'service-centre',
          'skill-training',
          'tuition-classes',
          'dance-gym-yoga',
          'language-classes',
          'academies',
          'ebooks-courses',
          'educational-consultancy',
          'second-hand-phones',
          'computer-repair',
          'cyber-cafe',
          'telecommunication',
          'saree-clothing',
        ]);
        
        // For each category, try to fetch products
        for (const category of allCategories) {
          if (!category.subcategories || category.subcategories.length === 0) continue;
          
          for (const subcategory of category.subcategories) {
            if (!subcategory.isActive) continue;
            
            const subSlug = toSlug(subcategory.slug || subcategory.name || '');
            const tableName = subcategoryToTable[subSlug] || subSlug;
            let products: any[] = [];

            if (!tableName || !allowedApiTables.has(tableName)) continue;
            
            try {
              // Try to fetch from the mapped table endpoint
              const res = await fetch(`/api/${encodeURIComponent(tableName)}?limit=10`);
              if (res.ok) {
                const data = await safeJson(res);
                // Handle various response formats
                if (Array.isArray(data)) {
                  products = data;
                } else if (data.items && Array.isArray(data.items)) {
                  products = data.items;
                } else if (data.results && Array.isArray(data.results)) {
                  products = data.results;
                } else if (data.data && Array.isArray(data.data)) {
                  products = data.data;
                }
              }
            } catch (err) {
              console.error(`Error fetching products from /api/${tableName}:`, err);
            }
            
            if (products.length > 0) {
              const key = `${category.id}__${subcategory.id}`;
              grouped[key] = { 
                category, 
                subcategory, 
                products: products.slice(0, 4) 
              };
            }
          }
        }
        
        return grouped;
      } catch (err) {
        console.error('Error fetching category products:', err);
        return {};
      }
    },
  });

  const { data: fashionProducts = [], isLoading: fashionLoading } = useQuery({
    queryKey: ["fashion-beauty-products"],
    queryFn: async () => {
      const res = await fetch('/api/fashion-beauty?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: carsBikes = [], isLoading: carsLoading } = useQuery({
    queryKey: ["cars-bikes"],
    queryFn: async () => {
      const res = await fetch('/api/cars-bikes?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: constructionMaterials = [], isLoading: constructionLoading } = useQuery({
    queryKey: ["construction-materials"],
    queryFn: async () => {
      const res = await fetch('/api/construction-materials?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Electronics & Gadgets
  const { data: electronicsGadgets = [], isLoading: electronicsLoading } = useQuery({
    queryKey: ["electronics-gadgets"],
    queryFn: async () => {
      const res = await fetch('/api/electronics-gadgets?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Phones, Tablets & Accessories
  const { data: phonesTablets = [], isLoading: phonesLoading } = useQuery({
    queryKey: ["phones-tablets"],
    queryFn: async () => {
      const res = await fetch('/api/phones-tablets-accessories?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Rental Listings
  const { data: rentalData = [], isLoading: rentalLoading } = useQuery({
    queryKey: ["rental-listings"],
    queryFn: async () => {
      const res = await fetch('/api/rental-listings?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Furniture & Decor
  const { data: furnitureData = [], isLoading: furnitureLoading } = useQuery({
    queryKey: ["furniture-decor"],
    queryFn: async () => {
      const res = await fetch('/api/furniture-decor?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Jewelry & Accessories
  const { data: jewelryData = [], isLoading: jewelryLoading } = useQuery({
    queryKey: ["jewelry-accessories"],
    queryFn: async () => {
      const res = await fetch('/api/jewelry-accessories?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Skill Training
  const { data: skillTraining = [], isLoading: skillLoading } = useQuery({
    queryKey: ["skill-training"],
    queryFn: async () => {
      const res = await fetch('/api/skill-training?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Tuition Classes
  const { data: tuitionClasses = [], isLoading: tuitionLoading } = useQuery({
    queryKey: ["tuition-classes"],
    queryFn: async () => {
      const res = await fetch('/api/tuition-classes?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Dance, Gym & Yoga
  const { data: danceGymYoga = [], isLoading: danceLoading } = useQuery({
    queryKey: ["dance-gym-yoga"],
    queryFn: async () => {
      const res = await fetch('/api/dance-gym-yoga?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Language Classes
  const { data: languageClasses = [], isLoading: languageLoading } = useQuery({
    queryKey: ["language-classes"],
    queryFn: async () => {
      const res = await fetch('/api/language-classes?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Health & Wellness
  const { data: healthWellness = [], isLoading: healthLoading } = useQuery({
    queryKey: ["health-wellness"],
    queryFn: async () => {
      const res = await fetch('/api/health-wellness?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Pharmacy & Medical
  const { data: pharmacyMedical = [], isLoading: pharmacyLoading } = useQuery({
    queryKey: ["pharmacy-medical"],
    queryFn: async () => {
      const res = await fetch('/api/pharmacy-medical?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Household Services
  const { data: householdServices = [], isLoading: householdLoading } = useQuery({
    queryKey: ["household-services"],
    queryFn: async () => {
      const res = await fetch('/api/household-services?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Event Decoration
  const { data: eventDecoration = [], isLoading: eventLoading } = useQuery({
    queryKey: ["event-decoration"],
    queryFn: async () => {
      const res = await fetch('/api/event-decoration?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Computer Repair Services
  const { data: computerRepair = [], isLoading: computerLoading } = useQuery({
    queryKey: ["computer-repair"],
    queryFn: async () => {
      const res = await fetch('/api/computer-repair?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Second Hand Cars & Bikes
  const { data: secondHandCarsBikes = [], isLoading: secondHandCarsLoading } = useQuery({
    queryKey: ["second-hand-cars-bikes"],
    queryFn: async () => {
      const res = await fetch('/api/second-hand-cars-bikes?limit=20');
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      // Normalize images field - handle both string and array formats
      return data.map((item: any) => ({
        ...item,
        images: typeof item.images === 'string' 
          ? (() => { try { const p = JSON.parse(item.images); return Array.isArray(p) ? p : [item.images]; } catch { return [item.images]; } })()
          : Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : []
      }));
    },
  });

  // Car & Bike Rentals
  const { data: carBikeRentals = [], isLoading: carBikeRentalsLoading } = useQuery({
    queryKey: ["car-bike-rentals"],
    queryFn: async () => {
      const res = await fetch('/api/car-bike-rentals?limit=20');
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      // Normalize images field
      return data.map((item: any) => ({
        ...item,
        images: typeof item.images === 'string' 
          ? (() => { try { const p = JSON.parse(item.images); return Array.isArray(p) ? p : [item.images]; } catch { return [item.images]; } })()
          : Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : []
      }));
    },
  });

  // Second Hand Phones
  const { data: secondHandPhones = [], isLoading: secondHandLoading } = useQuery({
    queryKey: ["second-hand-phones"],
    queryFn: async () => {
      const res = await fetch('/api/second-hand-phones?limit=20');
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      // Normalize images field
      return data.map((item: any) => ({
        ...item,
        images: typeof item.images === 'string' 
          ? (() => { try { const p = JSON.parse(item.images); return Array.isArray(p) ? p : [item.images]; } catch { return [item.images]; } })()
          : Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : []
      }));
    },
  });

  // Saree & Clothing
  const { data: sareeClothing = [], isLoading: sareeLoading } = useQuery({
    queryKey: ["saree-clothing"],
    queryFn: async () => {
      const res = await fetch('/api/saree-clothing?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // E-Books & Courses
  const { data: ebooksCourses = [], isLoading: ebooksLoading } = useQuery({
    queryKey: ["ebooks-courses"],
    queryFn: async () => {
      const res = await fetch('/api/ebooks-courses?limit=20');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Static data instead of API call, cast to Property type

  const handleSaveSearch = () => {
    console.log("Save search:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ priceType: "rent" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Header />

      {/* Category Navigation - Clean & Luxury with Animations */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 px-6 py-4 min-w-max">
              {categories.map((category: any, index: number) => {
                const Icon = resolveIconForCategory(category);
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(isActive ? "" : category.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className={`flex flex-col items-center justify-center px-8 py-4 min-w-[140px] rounded-xl transition-all duration-500 animate-fade-in-up ${
                      isActive
                        ? 'bg-gradient-to-br from-[#0B8457] to-[#059669] text-white shadow-2xl scale-110 -translate-y-1'
                        : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 ${
                      isActive ? 'bg-white/20 rotate-6 scale-110' : 'bg-white group-hover:rotate-3'
                    }`}>
                      {Icon ? (
                        <Icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'text-white animate-bounce-slow' : 'text-[#0B8457]'}`} />
                      ) : (
                        <DefaultIcon className={`w-6 h-6 ${isActive ? 'bg-white/20' : ''}`} />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight transition-all duration-300">
                      {category.name}
                    </span>
                  </button>
                );
              })}
                  {/* Static Skilled Labour tile to match other category tiles */}
                  <button
                    key="skilled-labour"
                    onClick={() => setLocation('/skilled-labour')}
                    style={{ animationDelay: `${categories.length * 0.05}s` }}
                    className={`flex flex-col items-center justify-center px-8 py-4 min-w-[140px] rounded-xl transition-all duration-500 animate-fade-in-up bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 bg-white group-hover:rotate-3`}>
                      <Briefcase className={`w-6 h-6 text-[#0B8457]`} />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight transition-all duration-300">
                      Skilled Labour
                    </span>
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* Expanded Category View with Subcategories */}
        {activeCategory && (() => {
          const selectedCategory = categories.find((c: any) => c.id === activeCategory);
          if (!selectedCategory) return null;

          const Icon = resolveIconForCategory(selectedCategory);
          const activeSubcategories = selectedCategory.subcategories?.filter((s: any) => s.isActive) || [];

          return (
            <div className="space-y-6 mt-6">
              {/* Category Header - Luxury Design */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B8457] via-[#059669] to-[#0B8457] p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
                    {Icon ? (
                      <Icon className="w-10 h-10 text-white" />
                    ) : (
                      <DefaultIcon className="w-10 h-10 bg-white/10 rounded-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2 text-white">{selectedCategory.name}</h3>
                    {selectedCategory.description && (
                      <p className="text-white/90 text-sm mb-2">{selectedCategory.description}</p>
                    )}
                    <p className="text-xs text-white/70 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                      {activeSubcategories.length} subcategories available
                    </p>
                  </div>
                </div>
              </div>

              {/* Subcategories Grid - Clean & Minimal with Animations */}
              {activeSubcategories.length > 0 ? (
                <div className="mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {activeSubcategories.map((subcategory: any, index: number) => {
                      // Resolve icon for each subcategory based on its own name/slug first
                      const SubIcon = resolveIconForCategory(subcategory);
                      const colorClass = pastelColors[index % pastelColors.length];
                      return (
                        <Link
                          key={subcategory.id}
                          to={`/category/${activeCategory}/subcategory/${encodeURIComponent(subcategory.slug)}`}
                          style={{ animationDelay: `${index * 0.08}s` }}
                          className={`${colorClass} p-6 rounded-2xl hover:shadow-xl transition-all duration-500 group border border-gray-200 animate-fade-in-up hover:scale-105 hover:-translate-y-1`}
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            {SubIcon ? (
                              <SubIcon className="w-8 h-8 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
                            ) : (
                              <DefaultIcon className="w-8 h-8" />
                            )}
                            <h3 className="font-medium text-sm leading-tight transition-all duration-300 group-hover:text-base">
                              {subcategory.name}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">No subcategories available</p>
                </div>
              )}
            </div>
          );
        })()}
      </section>

      <MarketplaceDisclaimerBanner />

      {/* Hero Slider Section */}
      <section className="container mx-auto px-4 py-8">
        <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5000 })]}>
          <CarouselContent>
            {slidersLoading ? (
              <CarouselItem>
                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-muted-foreground">Loading sliders...</div>
                </div>
              </CarouselItem>
            ) : sliders && sliders.length > 0 ? (
              sliders.map((s: any) => (
                <CarouselItem key={s.id}>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden bg-black/5">
                    <img 
                      src={s.imageUrl} 
                      alt={s.title || "slider"} 
                      className="w-full h-full  object-center"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (img.src && !img.src.startsWith('http') && !img.src.includes('localhost') && !img.src.includes('72.61.245.133')) {
                          const baseUrl = window.location.origin;
                          const newSrc = img.src.startsWith('/') ? baseUrl + img.src : baseUrl + '/' + img.src;
                          img.src = newSrc;
                        }
                      }}
                    />
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
              ))
            ) : (
              // Fallback static slides when no sliders configured
              <>
                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden bg-black/5">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=500&fit=crop"
                      alt="Nepal Real Estate"
                      className="w-full h-full  object-center bg-black/5"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden bg-black/5">
                    <img
                      src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=500&fit=crop"
                      alt="Nepal Services"
                      className="w-full h-full  object-center bg-black/5"
                    />
                  </div>
                </CarouselItem>

                <CarouselItem>
                  <div className="relative h-[500px] rounded-3xl overflow-hidden bg-black/5">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=500&fit=crop"
                      alt="Nepal Business"
                      className="w-full h-full  object-center bg-black/5"
                    />
                  </div>
                </CarouselItem>
              </>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

   

      {/* Slider Cards Carousel */}
      <section className="container mx-auto px-4 pb-8">
        {sliderCardsLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading cards...</div>
        ) : sliderCards && sliderCards.length > 0 ? (
          <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5000 })]}>
            <CarouselContent>
              {sliderCards.map((card: any) => (
                <CarouselItem key={card.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="flex-1 bg-gray-100">
                      {card.imageUrl ? (
                        <img 
                          src={card.imageUrl} 
                          alt={card.title || 'card image'} 
                          className="w-full h-48 "
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src && !img.src.startsWith('http') && !img.src.includes('localhost') && !img.src.includes('72.61.245.133')) {
                              const baseUrl = window.location.origin;
                              const newSrc = img.src.startsWith('/') ? baseUrl + img.src : baseUrl + '/' + img.src;
                              img.src = newSrc;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">No image</div>
                      )}
                    </div>

                    <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                      {card.title && <h3 className="font-semibold text-lg mb-2">{card.title}</h3>}
                      {card.description && <p className="text-sm text-muted-foreground mb-4">{card.description}</p>}
                      {card.linkUrl && (
                        <div>
                          <a href={card.linkUrl} className="inline-block bg-[#0B8457] text-white px-4 py-2 rounded-md hover:bg-[#059669] transition-colors">Learn more</a>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No slider cards available</div>
        )}
      </section>

      {/* Skilled Labour - Coming Soon Section */}
    
             
       
       

      {/* Services Carousel Section */}
      <section className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20">
        <div className="container mx-auto px-4">
          {/* Premium Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B8457]/10 to-[#059669]/10 rounded-full border border-[#0B8457]/20">
              <span className="w-2 h-2 rounded-full bg-[#0B8457]"></span>
              <span className="text-sm font-semibold text-[#0B8457]">Marketplace Showcase</span>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#0B8457] via-[#059669] to-[#0B8457] bg-clip-text text-transparent">
              Explore Our Collections
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover premium products and services from our verified partners. Browse through carefully curated collections tailored to your needs.
            </p>
            <div className="flex items-center justify-center gap-1 mt-6">
              <div className="h-1 w-8 bg-gradient-to-r from-[#0B8457] to-[#059669] rounded"></div>
              <div className="h-1 w-2 bg-[#0B8457] rounded"></div>
              <div className="h-1 w-8 bg-gradient-to-r from-[#059669] to-[#0B8457] rounded"></div>
            </div>
          </div>

          <div className="space-y-16">
            {/* Fashion & Beauty */}
            {fashionProducts && fashionProducts.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-[#0B8457] to-[#059669] rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Fashion & Beauty</h3>
                  <span className="ml-auto text-sm font-semibold text-[#0B8457] bg-[#0B8457]/10 px-4 py-1.5 rounded-full">
                    {fashionProducts.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5000 })]}>
                  <CarouselContent className="gap-4">
                    {fashionProducts.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Shirt className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                              {product.isFeatured && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  Featured
                                </div>
                              )}
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.category || 'Fashion'}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#0B8457]">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>4.5</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Fashion & Beauty Products', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-[#0B8457] to-[#059669] hover:from-[#059669] hover:to-[#0B8457] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Vehicles */}
            {carsBikes && carsBikes.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Vehicles</h3>
                  <span className="ml-auto text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                    {carsBikes.length} listings
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
                  <CarouselContent className="gap-4">
                    {carsBikes.map((vehicle: any) => (
                      <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {vehicle.images && vehicle.images[0] ? (
                                <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Car className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{vehicle.year} • {vehicle.vehicleType}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-600">₹{vehicle.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {vehicle.condition}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Cars & Bikes', vehicle.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Construction Materials */}
            {constructionMaterials && constructionMaterials.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Construction Materials</h3>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 7000 })]}>
                  <CarouselContent>
                    {constructionMaterials.map((material: any) => (
                      <CarouselItem key={material.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="flex flex-col h-full">
                          <Link to={`#`} className="flex-1">
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer">
                              <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden group">
                                {material.images && material.images[0] ? (
                                  <img src={material.images[0]} alt={material.name} className="w-full h-full  group-hover:scale-110 transition-transform duration-300" />
                                ) : (
                                  <Building className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-sm mb-1 line-clamp-2">{material.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{material.category}</p>
                                <span className="text-lg font-bold text-[#0B8457]">₹{material.price?.toLocaleString('en-IN') || 'N/A'}/{material.unit}</span>
                              </CardContent>
                            </Card>
                          </Link>
                          <div className="mt-3 px-0">
                            <Link to={buildCategoryItemHref('Construction Materials', material.id)} className="block w-full">
                              <button className="w-full bg-gradient-to-r from-[#0B8457] to-[#059669] hover:from-[#059669] hover:to-[#0B8457] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}

            {/* Electronics & Gadgets */}
            {electronicsGadgets && electronicsGadgets.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Electronics & Gadgets</h3>
                  <span className="ml-auto text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full">
                    {electronicsGadgets.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5500 })]}>
                  <CarouselContent className="gap-4">
                    {electronicsGadgets.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Monitor className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-purple-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Electronics & Gadgets', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Phones, Tablets & Accessories */}
            {phonesTablets && phonesTablets.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Phones, Tablets & Accessories</h3>
                  <span className="ml-auto text-sm font-semibold text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full">
                    {phonesTablets.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5800 })]}>
                  <CarouselContent className="gap-4">
                    {phonesTablets.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Smartphone className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.brand}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-pink-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Phones, Tablets & Accessories', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Rental Listings */}
            {rentalData && rentalData.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Rental Properties</h3>
                  <span className="ml-auto text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full">
                    {rentalData.length} listings
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
                  <CarouselContent className="gap-4">
                    {rentalData.map((property: any) => (
                      <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {property.images && property.images[0] ? (
                                <img src={property.images[0]} alt={property.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Building2 className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{property.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{property.city}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-amber-600">₹{property.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {property.bedrooms ? `${property.bedrooms}BHK` : 'Apt'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Rental Listings', property.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Furniture & Interior Decor */}
            {furnitureData && furnitureData.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Furniture & Interior Decor</h3>
                  <span className="ml-auto text-sm font-semibold text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full">
                    {furnitureData.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6200 })]}>
                  <CarouselContent className="gap-4">
                    {furnitureData.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={"#"} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Sofa className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-orange-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Furniture & Interior Decor', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Jewelry & Accessories */}
            {jewelryData && jewelryData.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Jewelry & Accessories</h3>
                  <span className="ml-auto text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full">
                    {jewelryData.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5900 })]}>
                  <CarouselContent className="gap-4">
                    {jewelryData.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Sparkles className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-rose-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Jewelry & Accessories', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Skill Training & Certification */}
            {skillTraining && skillTraining.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Skill Training & Certification</h3>
                  <span className="ml-auto text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                    {skillTraining.length} courses
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6300 })]}>
                  <CarouselContent className="gap-4">
                    {skillTraining.map((course: any) => (
                      <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {course.images && course.images[0] ? (
                                <img src={course.images[0]} alt={course.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Award className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{course.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{course.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-indigo-600">₹{course.fee?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {course.duration ? course.duration : 'Online'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Skill Training & Certification', course.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Tuition Classes */}
            {tuitionClasses && tuitionClasses.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Tuition & Private Classes</h3>
                  <span className="ml-auto text-sm font-semibold text-cyan-600 bg-cyan-50 px-4 py-1.5 rounded-full">
                    {tuitionClasses.length} courses
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5700 })]}>
                  <CarouselContent className="gap-4">
                    {tuitionClasses.map((course: any) => (
                      <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {course.images && course.images[0] ? (
                                <img src={course.images[0]} alt={course.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <GraduationCap className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{course.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{course.subject}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-cyan-600">₹{course.fee?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {course.duration ? course.duration : 'Online'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Tuition & Private Classes', course.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Dance, Gym & Yoga */}
            {danceGymYoga && danceGymYoga.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Dance, Gym & Yoga</h3>
                  <span className="ml-auto text-sm font-semibold text-red-600 bg-red-50 px-4 py-1.5 rounded-full">
                    {danceGymYoga.length} centers
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6100 })]}>
                  <CarouselContent className="gap-4">
                    {danceGymYoga.map((service: any) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {service.images && service.images[0] ? (
                                <img src={service.images[0]} alt={service.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Dumbbell className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{service.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{service.type}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-red-600">₹{service.fee?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {service.duration ? service.duration : 'Flex'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Dance, Karate, Gym & Yoga', service.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Language Classes */}
            {languageClasses && languageClasses.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Language Classes</h3>
                  <span className="ml-auto text-sm font-semibold text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">
                    {languageClasses.length} courses
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5600 })]}>
                  <CarouselContent className="gap-4">
                    {languageClasses.map((course: any) => (
                      <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {course.images && course.images[0] ? (
                                <img src={course.images[0]} alt={course.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Languages className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{course.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{course.language}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-teal-600">₹{course.fee?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {course.duration ? course.duration : 'Online'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Language Classes', course.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Health & Wellness */}
            {healthWellness && healthWellness.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Health & Wellness Services</h3>
                  <span className="ml-auto text-sm font-semibold text-green-600 bg-green-50 px-4 py-1.5 rounded-full">
                    {healthWellness.length} services
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6400 })]}>
                  <CarouselContent className="gap-4">
                    {healthWellness.map((service: any) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {service.images && service.images[0] ? (
                                <img src={service.images[0]} alt={service.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Shield className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{service.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{service.serviceType}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-600">₹{service.price?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {service.rating ? `${service.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Health & Wellness Services', service.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Household Services */}
            {householdServices && householdServices.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Household Services</h3>
                  <span className="ml-auto text-sm font-semibold text-yellow-600 bg-yellow-50 px-4 py-1.5 rounded-full">
                    {householdServices.length} services
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5900 })]}>
                  <CarouselContent className="gap-4">
                    {householdServices.map((service: any) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`/household-services/${service.id}`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {service.images && service.images[0] ? (
                                <img src={service.images[0]} alt={service.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <HomeIcon className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{service.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{service.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-yellow-600">₹{service.price?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {service.rating ? `${service.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={"#"} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Event Decoration Services */}
            {eventDecoration && eventDecoration.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-fuchsia-500 to-fuchsia-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Event Decoration Services</h3>
                  <span className="ml-auto text-sm font-semibold text-fuchsia-600 bg-fuchsia-50 px-4 py-1.5 rounded-full">
                    {eventDecoration.length} services
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6200 })]}>
                  <CarouselContent className="gap-4">
                    {eventDecoration.map((service: any) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {service.images && service.images[0] ? (
                                <img src={service.images[0]} alt={service.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Sparkles className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{service.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{service.serviceType}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-fuchsia-600">₹{service.price?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {service.rating ? `${service.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Event & Decoration Services', service.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Computer & Repair Services */}
            {computerRepair && computerRepair.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Computer & Repair Services</h3>
                  <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-1.5 rounded-full">
                    {computerRepair.length} services
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
                  <CarouselContent className="gap-4">
                    {computerRepair.map((service: any) => (
                      <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {service.images && service.images[0] ? (
                                <img src={service.images[0]} alt={service.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Laptop className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{service.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{service.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-600">₹{service.price?.toLocaleString('en-IN') || 'Contact'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {service.rating ? `${service.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Computer, Mobile & Laptop Repair Services', service.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Second Hand Phones & Tablets */}
            {secondHandPhones && secondHandPhones.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-lime-500 to-lime-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Second Hand Phones & Tablets</h3>
                  <span className="ml-auto text-sm font-semibold text-lime-600 bg-lime-50 px-4 py-1.5 rounded-full">
                    {secondHandPhones.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5800 })]}>
                  <CarouselContent className="gap-4">
                    {secondHandPhones.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Smartphone className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.condition}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-lime-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'Used'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Second Hand Phones & Accessories', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Second Hand Cars & Bikes */}
            {secondHandCarsBikes && secondHandCarsBikes.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Second Hand Cars & Bikes</h3>
                  <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-1.5 rounded-full">
                    {secondHandCarsBikes.length} listings
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
                  <CarouselContent className="gap-4">
                    {secondHandCarsBikes.map((vehicle: any) => (
                      <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {vehicle.images && vehicle.images[0] ? (
                                <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full group-hover/card:scale-125 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              ) : vehicle.imageUrl ? (
                                <img src={vehicle.imageUrl} alt={vehicle.title} className="w-full h-full group-hover/card:scale-125 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Car className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{vehicle.year} • {vehicle.vehicleType}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-600">₹{vehicle.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {vehicle.condition}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Second Hand Cars & Bikes', vehicle.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Car & Bike Rentals */}
            {carBikeRentals && carBikeRentals.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Car & Bike Rentals</h3>
                  <span className="ml-auto text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                    {carBikeRentals.length} listings
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
                  <CarouselContent className="gap-4">
                    {carBikeRentals.map((rental: any) => (
                      <CarouselItem key={rental.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                              {rental.images && rental.images[0] ? (
                                <img src={rental.images[0]} alt={rental.title} className="w-full h-full group-hover/card:scale-125 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              ) : rental.imageUrl ? (
                                <img src={rental.imageUrl} alt={rental.title} className="w-full h-full group-hover/card:scale-125 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Car className="w-12 h-12 text-blue-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{rental.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{rental.vehicleType} • {rental.brand} {rental.model}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-600">₹{rental.pricePerDay?.toLocaleString('en-IN') || rental.price?.toLocaleString('en-IN') || 'N/A'}/day</span>
                                  <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {String(rental.driverAvailable || '').includes('driver') ? 'With Driver' : 'Self Drive'}
                                  </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Car & Bike Rentals', rental.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* Saree & Clothing Shopping */}
            {sareeClothing && sareeClothing.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">Saree & Clothing Shopping</h3>
                  <span className="ml-auto text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full">
                    {sareeClothing.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6100 })]}>
                  <CarouselContent className="gap-4">
                    {sareeClothing.map((product: any) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Shirt className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{product.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{product.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-violet-600">₹{product.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.rating ? `${product.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('Saree & Clothing Shopping', product.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}

            {/* E-Books & Online Courses */}
            {ebooksCourses && ebooksCourses.length > 0 && (
              <div className="group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-sky-500 to-sky-600 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">E-Books & Online Courses</h3>
                  <span className="ml-auto text-sm font-semibold text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full">
                    {ebooksCourses.length} items
                  </span>
                </div>
                <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 5900 })]}>
                  <CarouselContent className="gap-4">
                    {ebooksCourses.map((course: any) => (
                      <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/4">
                        <div className="group/card overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <Link to={`#`} className="flex-1 flex flex-col">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {course.images && course.images[0] ? (
                                <img src={course.images[0]} alt={course.title} className="w-full h-full  group-hover/card:scale-125 transition-transform duration-500" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <BookOpen className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <div className="p-4 bg-white flex-1 flex flex-col">
                              <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900">{course.title}</h4>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">{course.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-sky-600">₹{course.price?.toLocaleString('en-IN') || 'Free'}</span>
                                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {course.rating ? `${course.rating}★` : 'New'}
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="px-4 pb-4">
                            <Link to={buildCategoryItemHref('E-Books & Online Courses', course.id)} className="w-full block">
                              <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-white hover:bg-gray-50 border border-gray-200" />
                  <CarouselNext className="right-0 bg-white hover:bg-gray-50 border border-gray-200" />
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0B8457] to-[#059669] bg-clip-text text-transparent">
            Featured Videos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch inspiring content from our community
          </p>
        </div>

        <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ stopOnInteraction: false, delay: 6000 })]}>
          <CarouselContent>
            {videosLoading ? (
              <CarouselItem>
                <div className="relative h-[260px] rounded-3xl overflow-hidden bg-gray-100 flex items-center">
                  <div className="text-muted-foreground">Loading videos...</div>
                </div>
              </CarouselItem>
            ) : videos && videos.length > 0 ? (
              videos.map((v: any) => (
                <CarouselItem
                  key={v.id}
                  className="basis-full md:basis-1/2 lg:basis-1/3 px-2"
                >
                  <div className="w-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
                    <div className="relative w-full aspect-[9/16] max-h-[420px] md:max-h-[380px] lg:max-h-[420px] bg-black flex items-center justify-center overflow-hidden">
                      <video
                        className="w-full h-full object-contain rounded-t-2xl"
                        preload="metadata"
                        controls
                        playsInline
                        muted
                        autoPlay
                      >
                        <source src={v.videoUrl || v.video_url} />
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{v.title || 'Untitled Video'}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{v.description || ''}</p>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {v.durationMinutes ? `${v.durationMinutes} min` : ''}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">No featured videos available</div>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

     


      {/* Blog Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Latest from Our Blog
            </h2>
            <p className="text-muted-foreground">Stay updated with tips, trends and insights</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogLoading ? (
            // show three placeholders while loading
            [1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="relative h-48 bg-gray-100" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : blogPosts && blogPosts.length > 0 ? (
            blogPosts.slice(0, 3).map((p: any) => {
              const words = (p.content || p.excerpt || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
              const readTime = Math.max(1, Math.ceil(words / 200));
              return (
                <Card key={p.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.coverImageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"}
                      alt={p.title || "Blog post"}
                      className="w-full h-full  group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600">{p.category || 'Blog'}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                      <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{p.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{p.authorName || 'Admin'}</span>
                      </div>
                      <span>{readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // fallback static placeholders if no posts
            <>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full  group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Market Trends</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    2025 Nepal Real Estate Market Outlook
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    An in-depth analysis of the upcoming trends in Nepal's real estate sector
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Mohit Sharma</span>
                    </div>
                    <span>8 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full  group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Investment</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    Top 10 Areas for Property Investment
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    Discover the most promising neighborhoods for real estate investment
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Ram Thapa</span>
                    </div>
                    <span>5 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop"
                    alt="Blog post"
                    className="w-full h-full  group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">Property Tips</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                    How to Get the Best Deal When Buying
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    Expert tips and negotiation strategies to help you secure the best price
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Asha Rai</span>
                    </div>
                    <span>7 min read</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Featured Articles & Research
            </h2>
            <p className="text-muted-foreground">In-depth guides and resources for your journey</p>
          </div>
          <Link to="/articles">
            <Button variant="outline" className="gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="relative h-48 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop"
                  alt="Article"
                  className="w-full h-full "
                />
              </div>
              <CardContent className="md:col-span-2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Guide</Badge>
                  <span className="text-sm text-muted-foreground">45 pages</span>
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                  Complete Guide to Property Registration in Nepal 2025
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  A comprehensive step-by-step guide covering all aspects of property registration
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    5.2K
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    12.4K
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="relative h-48 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
                  alt="Article"
                  className="w-full h-full "
                />
                <Badge className="absolute top-4 left-4 bg-amber-500">Premium</Badge>
              </div>
              <CardContent className="md:col-span-2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Research</Badge>
                  <span className="text-sm text-muted-foreground">78 pages</span>
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                  Nepal Real Estate Market Report 2024-2025
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  Annual market analysis featuring price trends and investment opportunities
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    8.7K
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    18.2K
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
 {/* More Details Section - Why Choose Us */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0B8457] to-[#059669] bg-clip-text text-transparent">
            Why Choose Jeevika Services?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nepal's most trusted platform connecting businesses and customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All services and products are verified for authenticity and quality
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Reach</h3>
              <p className="text-muted-foreground">
                Connect with thousands of potential customers across Nepal
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with advanced security
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0B8457] transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#0B8457]" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our team is always ready to help you with any queries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Everything You Need in One Place</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Easy Listing Process</h4>
                    <p className="text-muted-foreground">Post your ad in minutes with our simple interface</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Search & Filters</h4>
                    <p className="text-muted-foreground">Find exactly what you need with advanced filters</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Direct Communication</h4>
                    <p className="text-muted-foreground">Connect directly with sellers and service providers</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0B8457] text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Mobile Friendly</h4>
                    <p className="text-muted-foreground">Access from anywhere on any device</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-[#0B8457] mb-2">10,000+</div>
              <div className="text-xl font-semibold mb-4">Active Listings</div>
              <div className="text-muted-foreground mb-6">
                Join our growing community of businesses and customers
              </div>
              <Button size="lg" className="bg-[#0B8457] hover:bg-[#059669] text-white">
                Start Now
              </Button>
            </div>
          </div>
        </div>
      </section>
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