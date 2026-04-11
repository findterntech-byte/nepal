
import { Heart, User, Plus, Menu, X, Home, Building2, MapPin, Briefcase, Users as UsersIcon, GraduationCap, Settings, ChevronDown, Search, Facebook, Instagram, Linkedin, Twitter, MessageCircle, Youtube, LayoutDashboard, LogIn } from "lucide-react";
// TikTok icon is not in lucide-react, so use a generic icon or SVG if needed
import { Link, useLocation } from "wouter";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from '../../../attached_assets/Company Logo.png';
import { useQuery } from "@tanstack/react-query";

const iconMap: Record<string, any> = {
  'home': Home,
  'building': Building2,
  'map-pin': MapPin,
  'briefcase': Briefcase,
  'users': UsersIcon,
  'graduation-cap': GraduationCap,
  'settings': Settings,
};

// Map source/collection keys to icons and colors for Collections display
const sourceIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  'tuition': { icon: GraduationCap, color: '#ef4444' },
  'schools': { icon: Building2, color: '#3b82f6' },
  'languageClasses': { icon: GraduationCap, color: '#8b5cf6' },
  'skillTraining': { icon: GraduationCap, color: '#06b6d4' },
  'educationalConsultancy': { icon: Briefcase, color: '#f59e0b' },
  'ebooks': { icon: GraduationCap, color: '#6366f1' },
  'dance': { icon: GraduationCap, color: '#ec4899' },
  'academies': { icon: Building2, color: '#14b8a6' },
  'cricketTraining': { icon: Briefcase, color: '#f43f5e' },
  'electronics': { icon: Briefcase, color: '#06b6d4' },
  'phones': { icon: Briefcase, color: '#3b82f6' },
  'secondHandPhones': { icon: Briefcase, color: '#8b5cf6' },
  'computerRepair': { icon: Briefcase, color: '#f59e0b' },
  'cyberCafe': { icon: Briefcase, color: '#6366f1' },
  'telecommunication': { icon: Briefcase, color: '#ec4899' },
  'serviceCentre': { icon: Briefcase, color: '#14b8a6' },
  'fashion': { icon: Briefcase, color: '#f43f5e' },
  'sareeClothing': { icon: Briefcase, color: '#06b6d4' },
  'jewelry': { icon: Briefcase, color: '#3b82f6' },
  'healthWellness': { icon: Briefcase, color: '#8b5cf6' },
  'pharmacy': { icon: Briefcase, color: '#f59e0b' },
  'properties': { icon: Building2, color: '#3b82f6' },
  'rentals': { icon: Building2, color: '#06b6d4' },
  'hostelPg': { icon: Building2, color: '#8b5cf6' },
  'propertyDeals': { icon: Building2, color: '#f59e0b' },
  'commercialProperties': { icon: Building2, color: '#6366f1' },
  'officeSpaces': { icon: Building2, color: '#ec4899' },
  'industrialLand': { icon: MapPin, color: '#14b8a6' },
  'constructionMaterials': { icon: Briefcase, color: '#f43f5e' },
  'cars': { icon: Briefcase, color: '#06b6d4' },
  'secondHandCars': { icon: Briefcase, color: '#3b82f6' },
  'carBikeRentals': { icon: Briefcase, color: '#8b5cf6' },
  'heavyEquipment': { icon: Briefcase, color: '#f59e0b' },
  'showrooms': { icon: Building2, color: '#6366f1' },
  'vehicleLicense': { icon: Briefcase, color: '#ec4899' },
  'transportation': { icon: Briefcase, color: '#14b8a6' },
  'furniture': { icon: Briefcase, color: '#f43f5e' },
  'household': { icon: Briefcase, color: '#06b6d4' },
  'eventDecoration': { icon: Briefcase, color: '#3b82f6' },
  'construction-materials': { icon: Briefcase, color: '#f43f5e' },
  'electronics-gadgets': { icon: Briefcase, color: '#06b6d4' },
  'phones-tablets': { icon: Briefcase, color: '#3b82f6' },
  'second-hand-phones': { icon: Briefcase, color: '#8b5cf6' },
  'computer-repair': { icon: Briefcase, color: '#f59e0b' },
  'cyber-cafe': { icon: Briefcase, color: '#6366f1' },
  'cars-bikes': { icon: Briefcase, color: '#06b6d4' },
  'second-hand-cars-bikes': { icon: Briefcase, color: '#3b82f6' },
  'car-bike-rentals': { icon: Briefcase, color: '#8b5cf6' },
  'fashion-beauty': { icon: Briefcase, color: '#f43f5e' },
  'jewelry-accessories': { icon: Briefcase, color: '#06b6d4' },
  'furniture-interior-decor': { icon: Briefcase, color: '#3b82f6' },
  'pharmacy-medical': { icon: Briefcase, color: '#8b5cf6' },
  'household-services': { icon: Briefcase, color: '#f59e0b' },
  'health-wellness': { icon: Briefcase, color: '#6366f1' },
  'event-decoration': { icon: Briefcase, color: '#ec4899' },
  'service-centre': { icon: Briefcase, color: '#14b8a6' },
};

export default function Header() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const subScrollRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [submenuLeft, setSubmenuLeft] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showCategoriesPanel, setShowCategoriesPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string>("");
  

  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Record<string, boolean>>({});
  const [searchMode, setSearchMode] = useState<'or'|'and'>('or');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const { data: searchSources } = useQuery({
    queryKey: ["search-sources"],
    queryFn: async () => {
      const res = await fetch('/api/search/sources');
      if (!res.ok) return { sources: [] };
      return res.json();
    },
    enabled: true,
  });

  useEffect(() => {
    // initialize selectedSources to all available when searchSources loads
    if (searchSources?.sources && Object.keys(selectedSources).length === 0) {
      const map: Record<string, boolean> = {};
      searchSources.sources.forEach((s: any) => { map[s.key] = true; });
      setSelectedSources(map);
    }
  }, [searchSources]);

  const { data: searchSuggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery, selectedSources, searchMode],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { q: searchQuery, results: {} };
      const selected = Object.keys(selectedSources || {}).filter(k => selectedSources[k]);
      const sourcesParam = selected.length > 0 ? `&sources=${encodeURIComponent(selected.join(','))}` : '';
      const modeParam = searchMode === 'and' ? '&mode=all' : '';
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5${modeParam}${sourcesParam}`);
      if (!res.ok) return { q: searchQuery, results: {} };
      return res.json();
    },
    enabled: !!searchQuery && searchQuery.length >= 2,
  });

  function getItemLink(group: string, item: any) {
    const r = item.raw || item;
    if (!r) return '#';

    const buildCategoryItemHref = (categoryLabel: string, id: string) => `/${encodeURIComponent(categoryLabel)}/${id}`;

    const groupToCategoryLabel: Record<string, string> = {
      fashion: 'Fashion & Beauty Products',
      jewelry: 'Jewelry & Accessories',
      sareeClothing: 'Saree & Clothing Shopping',
      furniture: 'Furniture & Interior Decor',
      electronics: 'Electronics & Gadgets',
      phones: 'Phones, Tablets & Accessories',
      secondHandPhones: 'Second Hand Phones & Accessories',
      computerRepair: 'Computer, Mobile & Laptop Repair Services',
      cyberCafe: 'Cyber Café / Internet Services',
      telecommunication: 'Telecommunication Services',
      serviceCentre: 'Service Centre / Warranty',
      household: 'Household Services',
      eventDecoration: 'Event & Decoration Services',
      healthWellness: 'Health & Wellness Services',
      pharmacy: 'Pharmacy & Medical Stores',
      tuition: 'Tuition & Private Classes',
      languageClasses: 'Language Classes',
      dance: 'Dance, Karate, Gym & Yoga',
      academies: 'Academies - Music, Arts, Sports',
      skillTraining: 'Skill Training & Certification',
      schools: 'Schools, Colleges & Coaching',
      educationalConsultancy: 'Educational Consultancy & Study Abroad',
      ebooks: 'E-Books & Online Courses',
      cricketTraining: 'Cricket & Sports Training',
      secondHandCars: 'Second Hand Cars & Bikes',
      showrooms: 'Showrooms',
      carBikeRentals: 'Car & Bike Rentals',
      vehicleLicense: 'Vehicle License Classes',
      transportation: 'Transportation & Moving Services',
      constructionMaterials: 'Construction Materials',
      hostelPg: 'Hostel & PG',
      rentalListings: 'Rental Listings',
    };

    switch (group) {
      // Properties & Real Estate
      case 'properties':
        return `/properties/${r.id}`;
      case 'rentals':
        return `/properties/rent/${r.id}`;
      case 'propertyDeals':
        return `/properties/deal/${r.id}`;
      case 'commercialProperties':
        return `/properties/commercial/${r.id}`;
      case 'officeSpaces':
        return `/properties/office/${r.id}`;
      case 'cars':
        return `/vehicles/${r.id}`;
      case 'blogPosts':
        return `/blog/${r.slug || r.id}`;
      case 'articles':
        return `/articles/${r.id}`;
      case 'categories':
        return `/category/${r.slug || r.id}`;
      case 'subcategories':
        return `/subcategory/${r.slug || r.id}`;
      case 'users':
        return `/profile/${r.id}`;
      default:
        if (r.id) {
          const label = groupToCategoryLabel[group] || r.category || r.categoryName || r.subcategory || r.subcategoryName || group;
          return buildCategoryItemHref(label, r.id);
        }
        return '#';
    }
  }

  function buildSearchUrl(q: string) {
    const modeParam = searchMode === 'and' ? 'all' : 'or';
    const selected = Object.keys(selectedSources || {}).filter(k => selectedSources[k]);
    const sourcesParam = selected.length > 0 ? `&sources=${encodeURIComponent(selected.join(','))}` : '';
    return `/search?q=${encodeURIComponent(q)}&mode=${modeParam}${sourcesParam}`;
  }
  
  
  

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (activeCategory === categoryId) {
      setActiveCategory("");
      setShowSubcategories(false);
    } else {
      setActiveCategory(categoryId);
      setShowSubcategories(true);
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const activeCategories = categories.filter((cat: any) => cat.isActive);

  // Auto-expand first category on mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen && activeCategories.length > 0 && !mobileExpandedCategory) {
      setMobileExpandedCategory(activeCategories[0].id);
    }
  }, [isMobileMenuOpen, activeCategories, mobileExpandedCategory]);

  const activeCat = activeCategories.find((c: any) => c.id === activeCategory);

  // Build grouped services: each category once, with its active subcategories
  const serviceGroups: Array<any> = activeCategories.map((cat: any) => {
    const subs = (cat.subcategories || [])
      .filter((s: any) => s.isActive)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        type: 'subcategory',
        parent: { id: cat.id, name: cat.name, slug: cat.slug },
      }));

    const catEntry = { id: cat.id, name: cat.name, slug: cat.slug, type: 'category' };

    return { category: catEntry, subcategories: subs };
  });

  

  const navItems = [
    { href: "/properties", label: "घर जग्गा | Properties", shortLabel: "Properties", isActive: location.startsWith("/properties") || location === "/", hasRoute: true },
    { href: "/vehicles", label: "सवारी | Vehicles", shortLabel: "Vehicles", isActive: location.startsWith("/vehicles"), hasRoute: false },
    { href: "/jobs", label: "रोजगार | Jobs", shortLabel: "Jobs", isActive: location.startsWith("/jobs"), hasRoute: false },
    { href: "/services", label: "सेवा | Services", shortLabel: "Services", isActive: location.startsWith("/services"), hasRoute: false },
    { href: "/education", label: "शिक्षा | Education", shortLabel: "Education", isActive: location.startsWith("/education"), hasRoute: false },
    { href: "/health", label: "स्वास्थ्य | Health", shortLabel: "Health", isActive: location.startsWith("/health"), hasRoute: false },
  ];

  const topNav = [
    { href: "/", label: "Home", isActive: location === "/" || location.startsWith("/") },
    { href: "/about", label: "About Us", isActive: location.startsWith("/about") },
    { href: "/contact", label: "Contact", isActive: location.startsWith("/contact") },
    { href: "/blog", label: "Blog", isActive: location.startsWith("/blog") },
    { href: "/articles", label: "Articles", isActive: location.startsWith("/articles") },
    { href: "/terms-and-conditions", label: "Terms & Conditions", isActive: location.startsWith("/terms-and-conditions") },
    { href: "/privacy-policy", label: "Privacy Policy", isActive: location.startsWith("/privacy-policy") },
  ];

  // compute backend + local combined suggestions
  const backendSuggestions = searchSuggestions?.results || {};

  // build local matches from topNav (pages) and serviceGroups (categories/subcategories)
  const localMatches: Record<string, any[]> = (() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q || q.length < 1) return {} as Record<string, any[]>;
    const tokens = q.split(/\s+/).filter(Boolean);

    const pages = topNav.filter(p => tokens.some(t => p.label.toLowerCase().includes(t))).map(p => ({ href: p.href, label: p.label }));

    const categories: any[] = [];
    const subcategories: any[] = [];
    serviceGroups.forEach((grp) => {
      const catName = (grp.category.name || '').toLowerCase();
      const catMatched = tokens.some(t => catName.includes(t));
      if (catMatched) {
        categories.push({ id: grp.category.id, name: grp.category.name, slug: grp.category.slug });
      }
      grp.subcategories.forEach((s: any) => {
        const subName = (s.name || '').toLowerCase();
        if (tokens.some(t => subName.includes(t))) {
          subcategories.push({ id: s.id, name: s.name, slug: s.slug, parent: grp.category });
        }
      });
    });

    return { pages, categories, subcategories };
  })();

  // merge backend suggestions with localMatches (concatenate arrays, avoid duplicates roughly by id/name)
  const combinedResults: Record<string, any[]> = {};
  const groups = new Set([...Object.keys(backendSuggestions), ...Object.keys(localMatches)]);
  groups.forEach((g) => {
    const fromBackend = Array.isArray(backendSuggestions[g]) ? backendSuggestions[g] : [];
    const fromLocal = Array.isArray(localMatches[g]) ? localMatches[g] : [];
    // simple merge: backend first, then local (could dedupe if needed)
    combinedResults[g] = [...fromBackend, ...fromLocal];
  });

  const combinedTotal = Object.values(combinedResults).reduce((acc: number, cur: any) => {
    if (Array.isArray(cur)) return acc + cur.length;
    return acc;
  }, 0);

  const currentUser = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfileMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* Top simple nav - static links */}
      <div className="bg-white border-b hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Social Media Links - Left Side */}
            <div className="flex items-center space-x-3">
              <a href="https://www.facebook.com/share/1GKbiCHhY1/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/jeevika_1631?igsh=MTk1M2NmeGV3ajlrdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/jeevika-services-pvt-ltd/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://x.com/jeevika1631?s=21" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://wa.me/9779709142561" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/channel/UCfOq8T-NtTGC-hC06_qnBaQ" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@jeevika.services?_r=1&_t=ZS-924Vhw7hXYy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors" aria-label="TikTok">
                {/* TikTok SVG icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12.5 2h3a1 1 0 0 1 1 1v2.5a4.5 4.5 0 0 0 4.5 4.5h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2.5a7.5 7.5 0 1 1-7.5-7.5V3a1 1 0 0 1 1-1z"/></svg>
              </a>
            </div>

            {/* Navigation Links - Right Side */}
            <nav className="flex items-center space-x-4 text-sm">
              {topNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded-md hover:bg-gray-100 transition-colors ${
                    item.isActive ? "font-semibold text-gray-900" : "text-gray-700"
                  }`}
                  aria-label={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <header ref={headerRef} className="nepal-gradient text-primary-foreground shadow-lg sticky top-0 z-50" data-testid="header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3" data-testid="link-home">
              <div className="flex items-center space-x-2 md:space-x-3 text-white">
                <img src={Logo} alt="Jeevika logo" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-contain" />
                <div className="hidden sm:block">
                  <span className="text-white text-lg md:text-xl tracking-wide font-bold">JEEVIKA</span>
                  <div className="text-xs text-accent/90 -mt-1 font-medium hidden md:block">सेवा प्रा. लि. | Services Pvt. Ltd.</div>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:flex items-start gap-3" data-testid="search-bar">
              {/* Categories dropdown trigger (desktop) */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoriesPanel((s) => !s)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
                  aria-expanded={showCategoriesPanel}
                  aria-haspopup="true"
                >
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showCategoriesPanel && (
                  <div className="absolute left-0 mt-2 w-[28rem] bg-white shadow-xl rounded-md z-50 max-h-80 overflow-auto">
                    <div className="p-3">
                      {activeCategories.length === 0 ? (
                        <div className="text-sm text-gray-500">No categories</div>
                      ) : (
                        activeCategories.map((category: any) => {
                          const subs = (category.subcategories || []).filter((s: any) => s.isActive);
                          return (
                            <div key={category.id} className="border-b last:border-b-0">
                              <div className="px-3 py-2 text-sm font-medium text-gray-800">{category.name}</div>
                              {subs.length === 0 ? (
                                <div className="px-6 py-2 text-sm text-gray-500">No subcategories</div>
                              ) : (
                                subs.map((sub: any) => (
                                  <button
                                    key={sub.id}
                                    onMouseDown={(ev) => ev.preventDefault()}
                                    onClick={() => { setLocation(`/subcategory/${sub.slug}`); setShowCategoriesPanel(false); }}
                                    className="w-full text-left px-6 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{sub.name}</span>
                                      <span className="text-xs text-gray-400">{category.name}</span>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search properties, vehicles, jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchPopup(true)}
                 
                  className="w-full pl-10 pr-4 py-2 bg-white/90 border-white/20 focus:bg-white text-black"
                />
                {/* Close / clear icon inside the input */}
                <button
                  type="button"
                  onMouseDown={(ev) => ev.preventDefault()}
                  onClick={() => { setSearchQuery(''); setShowSearchPopup(false); }}
                  aria-label="Close search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-white/0 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
                {/** full popup when input focused */}
                {showSearchPopup && (
                  <div className="absolute left-0 right-0 mt-2 bg-white shadow-xl rounded-md z-50 max-h-[60vh] overflow-auto p-4 text-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium">Search options</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSearchMode((m) => m === 'or' ? 'and' : 'or')}
                          className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800"
                        >Mode: {searchMode === 'or' ? 'OR' : 'AND'}</button>
                        <button onClick={() => setShowSearchPopup(false)} className="px-2 py-1 bg-gray-100 rounded text-gray-800">Close</button>
                      </div>
                    </div>

               

                

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Pages</div>
                      <div className="flex flex-wrap gap-2">
                        {topNav.map((p) => (
                          <button
                            key={p.href}
                            onMouseDown={(ev) => ev.preventDefault()}
                            onClick={() => { setShowSearchPopup(false); setLocation(p.href); }}
                            className="text-sm px-3 py-1 bg-white border rounded text-gray-800"
                          >{p.label}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Results</div>
                      {(!searchQuery || searchQuery.length < 2) ? (
                        <div className="text-sm text-gray-500">Type at least 2 characters to search</div>
                      ) : (combinedTotal > 0) ? (
                        <div className="space-y-2">
                          {Object.entries(combinedResults).map(([group, items]) => (
                            Array.isArray(items) && items.length > 0 ? (
                              <div key={group} className="mb-1">
                                <div className="text-sm font-medium text-gray-800 px-2 py-1 capitalize">{group}</div>
                                <div className="divide-y rounded border">
                                  {items.map((it: any, idx: number) => {
                                    const phone = it.raw?.contactPhone || it.raw?.phone || it.raw?.whatsappNumber || it.contactPhone || it.phone || it.whatsappNumber;
                                    const whatsapp = it.raw?.whatsappNumber || it.whatsappNumber;
                                    const title = group === 'pages' ? it.label : group === 'categories' ? it.name : group === 'subcategories' ? (it.name + (it.parent ? ` — ${it.parent.name}` : '')) : (it.title || it.name || it.raw?.name || it.raw?.title || it.id || String(it));

                                    return (
                                      <div key={idx} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                                        <button
                                          onMouseDown={(ev) => ev.preventDefault()}
                                          onClick={() => {
                                            setShowSearchPopup(false);
                                            // pages
                                            if (group === 'pages') {
                                              setLocation(it.href);
                                              return;
                                            }
                                            // categories -> perform scoped search
                                            if (group === 'categories') {
                                              setLocation(buildSearchUrl(searchQuery) + `&category=${encodeURIComponent(it.slug)}`);
                                              return;
                                            }
                                            // subcategories -> perform scoped search with optional parent category
                                            if (group === 'subcategories') {
                                              const parentSlug = it.parent?.slug || it.parentSlug || '';
                                              const categoryPart = parentSlug ? `&category=${encodeURIComponent(parentSlug)}` : '';
                                              setLocation(`/subcategory/${it.slug}`);
                                              setShowCategoriesPanel(false);
                                              return;
                                            }
                                            // fallback to backend item link resolver
                                            setLocation(getItemLink(group, it));
                                          }}
                                          className="text-left text-sm text-gray-700 flex-1 truncate"
                                        >
                                          {title}
                                        </button>

                                        {phone ? (
                                          <div className="flex items-center gap-2 ml-3">
                                            {whatsapp ? (
                                              <button
                                                onMouseDown={(ev) => ev.stopPropagation()}
                                                onClick={(ev) => { ev.stopPropagation(); window.open(`https://wa.me/${String(whatsapp).replace(/\D/g, '')}`); }}
                                                className="text-xs px-2 py-1 bg-green-50 border rounded text-green-700"
                                              >
                                                WhatsApp
                                              </button>
                                            ) : null}
                                            <button
                                              onMouseDown={(ev) => ev.stopPropagation()}
                                              onClick={(ev) => { ev.stopPropagation(); window.open(`tel:${String(phone).replace(/\s+/g, '')}`); }}
                                              className="text-xs px-2 py-1 bg-blue-50 border rounded text-blue-700"
                                            >
                                              Call
                                            </button>
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No results found</div>
                      )}
                    </div>

                    {/* Collections Section */}
                    {searchQuery && searchQuery.length >= 2 && searchSuggestions?.collections && Object.keys(searchSuggestions.collections).length > 0 && (
                      <div className="mb-3 border-t pt-3">
                        <div className="text-xs font-semibold text-gray-700 mb-2 px-2">Explore Our Collections</div>
                        <div className="text-xs text-gray-500 mb-2 px-2">Discover premium products and services from our verified partners</div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {Object.entries(searchSuggestions.collections).map(([categoryName, categoryResults]: any) => (
                            Object.keys(categoryResults).length > 0 && (
                              <div key={categoryName} className="border rounded-lg p-2 bg-gray-50">
                                <div className="text-sm font-medium text-gray-800 mb-2">{categoryName}</div>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(categoryResults).map(([source, items]: any) => {
                                    const sourceIcon = sourceIconMap[source];
                                    const IconComp = sourceIcon?.icon || Briefcase;
                                    return Array.isArray(items) && items.length > 0 ? (
                                      <button
                                        key={source}
                                        onMouseDown={(ev) => ev.preventDefault()}
                                        onClick={() => {
                                          setShowSearchPopup(false);
                                          setLocation(buildSearchUrl(searchQuery) + `&sources=${source}`);
                                        }}
                                        className="text-xs px-2 py-1 bg-white border rounded hover:bg-blue-50 text-gray-700 whitespace-nowrap flex items-center gap-1.5"
                                      >
                                        <IconComp className="w-3 h-3 flex-shrink-0" style={{ color: sourceIcon?.color || '#666' }} />
                                        <span>
                                        {source === 'tuition' && 'Tuition & Private Classes'}
                                        {source === 'schools' && 'Schools & Colleges'}
                                        {source === 'languageClasses' && 'Language Classes'}
                                        {source === 'skillTraining' && 'Skill Training'}
                                        {source === 'educationalConsultancy' && 'Educational Consultancy'}
                                        {source === 'ebooks' && 'E-Books & Courses'}
                                        {source === 'dance' && 'Dance & Fitness'}
                                        {source === 'academies' && 'Academies'}
                                        {source === 'cricketTraining' && 'Cricket Training'}
                                        {source === 'electronics' && 'Electronics & Gadgets'}
                                        {source === 'phones' && 'Phones & Tablets'}
                                        {source === 'secondHandPhones' && 'Second Hand Phones'}
                                        {source === 'computerRepair' && 'Computer Repair'}
                                        {source === 'cyberCafe' && 'Cyber Cafe'}
                                        {source === 'telecommunication' && 'Telecom Services'}
                                        {source === 'serviceCentre' && 'Service Centre'}
                                        {source === 'fashion' && 'Fashion & Beauty'}
                                        {source === 'sareeClothing' && 'Saree & Clothing'}
                                        {source === 'jewelry' && 'Jewelry & Accessories'}
                                        {source === 'healthWellness' && 'Health & Wellness'}
                                        {source === 'pharmacy' && 'Pharmacy & Medical'}
                                        {source === 'properties' && 'Properties'}
                                        {source === 'rentals' && 'Rental Listings'}
                                        {source === 'hostelPg' && 'Hostel & PG'}
                                        {source === 'propertyDeals' && 'Property Deals'}
                                        {source === 'commercialProperties' && 'Commercial Properties'}
                                        {source === 'officeSpaces' && 'Office Spaces'}
                                        {source === 'industrialLand' && 'Industrial Land'}
                                        {source === 'constructionMaterials' && 'Construction Materials'}
                                        {source === 'construction-materials' && 'Construction Materials'}
                                        {source === 'cars' && 'Cars & Bikes'}
                                        {source === 'cars-bikes' && 'Cars & Bikes'}
                                        {source === 'secondHandCars' && 'Second Hand Vehicles'}
                                        {source === 'second-hand-cars-bikes' && 'Second Hand Vehicles'}
                                        {source === 'carBikeRentals' && 'Vehicle Rentals'}
                                        {source === 'car-bike-rentals' && 'Vehicle Rentals'}
                                        {source === 'heavyEquipment' && 'Heavy Equipment'}
                                        {source === 'showrooms' && 'Showrooms'}
                                        {source === 'vehicleLicense' && 'Vehicle License'}
                                        {source === 'transportation' && 'Transportation Services'}
                                        {source === 'furniture' && 'Furniture & Decor'}
                                        {source === 'household' && 'Household Services'}
                                        {source === 'household-services' && 'Household Services'}
                                        {source === 'eventDecoration' && 'Event Decoration'}
                                        {source === 'event-decoration' && 'Event Decoration'}
                                        {source === 'electronics-gadgets' && 'Electronics & Gadgets'}
                                        {source === 'phones-tablets' && 'Phones & Tablets'}
                                        {source === 'second-hand-phones' && 'Second Hand Phones'}
                                        {source === 'computer-repair' && 'Computer Repair'}
                                        {source === 'cyber-cafe' && 'Cyber Cafe'}
                                        {source === 'fashion-beauty' && 'Fashion & Beauty'}
                                        {source === 'jewelry-accessories' && 'Jewelry & Accessories'}
                                        {source === 'furniture-interior-decor' && 'Furniture & Decor'}
                                        {source === 'pharmacy-medical' && 'Pharmacy & Medical'}
                                        {source === 'health-wellness' && 'Health & Wellness'}
                                        {source === 'service-centre' && 'Service Centre'}
                                        {!['tuition', 'schools', 'languageClasses', 'skillTraining', 'educationalConsultancy', 'ebooks', 'dance', 'academies', 'cricketTraining', 'electronics', 'phones', 'secondHandPhones', 'computerRepair', 'cyberCafe', 'telecommunication', 'serviceCentre', 'fashion', 'sareeClothing', 'jewelry', 'healthWellness', 'pharmacy', 'properties', 'rentals', 'hostelPg', 'propertyDeals', 'commercialProperties', 'officeSpaces', 'industrialLand', 'constructionMaterials', 'cars', 'secondHandCars', 'carBikeRentals', 'heavyEquipment', 'showrooms', 'vehicleLicense', 'transportation', 'furniture', 'household', 'eventDecoration', 'construction-materials', 'electronics-gadgets', 'phones-tablets', 'second-hand-phones', 'computer-repair', 'cyber-cafe', 'cars-bikes', 'second-hand-cars-bikes', 'car-bike-rentals', 'fashion-beauty', 'jewelry-accessories', 'furniture-interior-decor', 'pharmacy-medical', 'household-services', 'health-wellness', 'event-decoration', 'service-centre'].includes(source) && source}
                                        </span>
                                        ({items.length})
                                      </button>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    

                   
                  </div>
                )}
                
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4" data-testid="header-actions">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:text-sm px-2 md:px-4"
                data-testid="button-post-ad"
                onClick={() => setLocation('/post-ad')}
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Post Ad</span>
                <span className="sm:hidden">Post</span>
              </Button>

              <Link href="/wishlist" className="relative" data-testid="button-wishlist">
                <button className="p-2 hover:bg-primary/80 rounded-lg transition-colors hidden sm:block" aria-label="Wishlist">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {(() => {
                  try {
                    const stored = localStorage.getItem('neapl_wishlist_v1');
                    const list = stored ? JSON.parse(stored) : [];
                    if (list && list.length > 0) {
                      return (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">{list.length}</span>
                      );
                    }
                  } catch (e) {
                    return null;
                  }
                  return null;
                })()}
              </Link>

              {currentUser ? (
                <div className="hidden sm:block relative" ref={profileMenuRef} data-testid="button-profile">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((s) => !s)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-primary/80 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                  >
                    {(() => {
                      const initial = currentUser?.firstName?.[0] || currentUser?.username?.[0] || 'U';
                      return (
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity">
                          {String(initial).toUpperCase()}
                        </div>
                      );
                    })()}
                    <ChevronDown className="w-4 h-4 text-white/90" />
                  </button>

                  {profileMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Profile menu"
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        <button
                          role="menuitem"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            setLocation('/profile');
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                        >
                          Profile
                        </button>
                        {currentUser?.accountType === 'seller' && (
                          <button
                            role="menuitem"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              setLocation('/seller-dashboard');
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                        <button
                          role="menuitem"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-2 p-2 hover:bg-primary/80 rounded-lg transition-colors" data-testid="button-login">
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="hidden md:inline text-white">Login</span>
                </Link>
              )}
              {/* Mobile Menu (Drawer) */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="lg:hidden p-2 hover:bg-primary/80 rounded-lg transition-colors"
                    data-testid="button-mobile-menu"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>

                <SheetContent side="left" className="p-0 w-[85vw] sm:max-w-sm overflow-y-auto">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-3">
                      <img src={Logo} alt="Jeevika logo" className="w-8 h-8 rounded-lg object-contain" />
                      <span className="font-bold">JEEVIKA</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Search</div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="pl-10"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsMobileMenuOpen(false);
                              setLocation(buildSearchUrl(searchQuery));
                            }
                          }}
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setLocation(buildSearchUrl(searchQuery));
                        }}
                      >
                        Search
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Pages</div>
                      <div className="space-y-1">
                        {topNav.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Categories</div>
                      <div className="space-y-2">
                        {activeCategories.map((category: any) => {
                          const Icon = iconMap[category.icon] || Briefcase;
                          const subs = (category.subcategories || []).filter((sub: any) => sub.isActive);
                          const hasSubcategories = subs.length > 0;
                          const isExpanded = mobileExpandedCategory === category.id;

                          return (
                            <div key={category.id} className="border rounded-lg overflow-hidden">
                              <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setMobileExpandedCategory(isExpanded ? "" : category.id);
                                }}
                              >
                                <div
                                  className="flex-1 flex items-center gap-3 py-3 px-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Icon className="w-5 h-5" />
                                  <span className="font-medium">{category.name}</span>
                                </div>
                                {hasSubcategories && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileExpandedCategory(isExpanded ? "" : category.id); }}
                                    className="p-3 hover:bg-gray-50"
                                    aria-label="Toggle subcategories"
                                  >
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </div>

                              {hasSubcategories && isExpanded && (
                                <div className="border-t bg-gray-50">
                                  {subs.map((subcategory: any) => (
                                    <Link
                                      key={subcategory.id}
                                      href={`/subcategory/${subcategory.slug}`}
                                      className="block py-2.5 px-4 text-sm text-gray-700 hover:bg-white transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t space-y-2">
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Wishlist</span>
                      </Link>
                      {(() => {
                        if (!currentUser) return null;
                        if (currentUser?.accountType !== 'seller') return null;
                        return (
                          <Link
                            href="/seller-dashboard"
                            className="flex items-center gap-3 py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                          </Link>
                        );
                      })()}
                      {currentUser ? (
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="flex items-center gap-3 py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LogIn className="w-5 h-5" />
                          <span>Login</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
