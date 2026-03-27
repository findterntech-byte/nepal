import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  Zap,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  ImageIcon,
  Copy,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceData {
  id: string;
  title: string;
  category: string;
  price?: number;
  priceType?: string;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  address?: string;
  phone?: string;
  email?: string;
  isFeatured?: boolean;
  seller?: {
    name: string;
    rating: number;
    reviews: number;
    responseTime: string;
    verified: boolean;
    logo?: string;
    avatar?: string;
  };
  features?: string[];
  amenities?: string[];
  highlights?: string[];
  createdAt?: string;
  condition?: string;
  [key: string]: any;
}

// Category-Specific Fields Component
function CategorySpecificFields({ service }: { service: ServiceData }) {
  const category = service.category?.toLowerCase() || "";
  
  // Map of category names to field configurations
  const categoryFields: { [key: string]: Array<{ label: string; key: string; format?: (val: any) => string }> } = {
    "dance-gym-yoga": [
      { label: "Instructor Name", key: "instructorName" },
      { label: "Class Type", key: "classType" },
      { label: "Class Category", key: "classCategory" },
      { label: "Fee Per Month", key: "feePerMonth", format: (v) => `₹${v}` },
      { label: "Sessions Per Week", key: "sessionsPerWeek" },
      { label: "Session Duration", key: "sessionDurationMinutes", format: (v) => `${v} minutes` },
      { label: "Equipment Provided", key: "equipmentProvided", format: (v) => v ? "Yes" : "No" },
      { label: "Trial Class Available", key: "trialClassAvailable", format: (v) => v ? "Yes" : "No" },
      { label: "Weekend Batches", key: "weekendBatches", format: (v) => v ? "Available" : "Not Available" },
      { label: "Batch Size", key: "batchSize" },
      { label: "Certification Provided", key: "certificationProvided", format: (v) => v ? "Yes" : "No" },
    ],
    "language-classes": [
      { label: "Instructor Name", key: "instructorName" },
      { label: "Language", key: "language" },
      { label: "Level", key: "proficiencyLevel" },
      { label: "Fee Per Month", key: "feePerMonth", format: (v) => `₹${v}` },
      { label: "Sessions Per Week", key: "sessionsPerWeek" },
      { label: "Class Duration", key: "sessionDurationMinutes", format: (v) => `${v} minutes` },
      { label: "Batch Size", key: "batchSize" },
      { label: "Trial Class Available", key: "trialClassAvailable", format: (v) => v ? "Yes" : "No" },
      { label: "Certification", key: "certificationProvided", format: (v) => v ? "Yes" : "No" },
    ],
    "tuition-classes": [
      { label: "Instructor Name", key: "instructorName" },
      { label: "Subject", key: "subject" },
      { label: "Class Level", key: "classLevel" },
      { label: "Fee Per Month", key: "feePerMonth", format: (v) => `₹${v}` },
      { label: "Sessions Per Week", key: "sessionsPerWeek" },
      { label: "Class Duration", key: "sessionDurationMinutes", format: (v) => `${v} minutes` },
      { label: "Batch Size", key: "batchSize" },
      { label: "Online/Offline", key: "classFormat" },
      { label: "Trial Class", key: "trialClassAvailable", format: (v) => v ? "Yes" : "No" },
    ],
    "health-wellness": [
      { label: "Service Type", key: "serviceType" },
      { label: "Specialist", key: "specialistName" },
      { label: "Qualifications", key: "qualifications" },
      { label: "Experience", key: "experienceYears", format: (v) => `${v} years` },
      { label: "Consultation Fee", key: "consultationFee", format: (v) => `₹${v}` },
      { label: "Available Days", key: "availableDays" },
      { label: "Appointment Duration", key: "appointmentDurationMinutes", format: (v) => `${v} minutes` },
    ],
    "skill-training": [
      { label: "Trainer Name", key: "trainerName" },
      { label: "Skill Type", key: "skillType" },
      { label: "Course Duration", key: "courseDurationDays", format: (v) => `${v} days` },
      { label: "Fee", key: "courseFee", format: (v) => `₹${v}` },
      { label: "Batch Size", key: "batchSize" },
      { label: "Certification", key: "certificationProvided", format: (v) => v ? "Yes" : "No" },
      { label: "Job Placement", key: "jobPlacementAssistance", format: (v) => v ? "Available" : "Not Available" },
      { label: "Schedule", key: "schedule" },
    ],
    "electronics-gadgets": [
      { label: "Brand", key: "brand" },
      { label: "Model", key: "model" },
      { label: "Condition", key: "condition" },
      { label: "Warranty", key: "warranty" },
      { label: "Stock Available", key: "stockAvailable" },
    ],
    "phones-tablets-accessories": [
      { label: "Brand", key: "brand" },
      { label: "Model", key: "model" },
      { label: "Condition", key: "condition", format: (v) => v === "new" ? "Brand New" : v === "used" ? "Used" : v === "refurbished" ? "Refurbished" : v },
      { label: "Warranty", key: "warranty" },
      { label: "Stock", key: "stockAvailable" },
    ],
    "construction-materials": [
      { label: "Material Type", key: "materialType" },
      { label: "Quantity Available", key: "quantityAvailable" },
      { label: "Unit", key: "unit" },
      { label: "Grade/Quality", key: "grade" },
      { label: "Certification", key: "certification" },
      { label: "Delivery Available", key: "deliveryAvailable", format: (v) => v ? "Yes" : "No" },
    ],
    "fashion-beauty": [
      { label: "Brand", key: "brand" },
      { label: "Size", key: "size" },
      { label: "Color", key: "color" },
      { label: "Material", key: "material" },
      { label: "Stock", key: "stockAvailable" },
    ],
    "jewelry-accessories": [
      { label: "Material", key: "material" },
      { label: "Weight", key: "weight", format: (v) => `${v} grams` },
      { label: "Purity", key: "purity" },
      { label: "Certificate", key: "hasCertificate", format: (v) => v ? "Yes" : "No" },
      { label: "Stock", key: "stockAvailable" },
    ],
    "cars-bikes": [
      { label: "Brand", key: "brand" },
      { label: "Model", key: "model" },
      { label: "Year", key: "year" },
      { label: "KM Driven", key: "kmDriven", format: (v) => `${v} km` },
      { label: "Fuel Type", key: "fuelType" },
      { label: "Transmission", key: "transmission" },
      { label: "Owner", key: "ownerCount" },
      { label: "Insurance", key: "insurance" },
    ],
    "rental-listings": [
      { label: "Property Type", key: "propertyType" },
      { label: "Bedrooms", key: "bedrooms" },
      { label: "Bathrooms", key: "bathrooms" },
      { label: "Area", key: "area", format: (v) => `${v} sq ft` },
      { label: "Furnished", key: "furnished", format: (v) => v ? "Yes" : "No" },
      { label: "Parking", key: "parking", format: (v) => v ? "Available" : "Not Available" },
    ],
  };

  // Get fields for this category
  const fields = categoryFields[category] || [];

  if (fields.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const value = service[field.key];
          if (value === null || value === undefined || value === "") return null;
          
          const displayValue = field.format ? field.format(value) : value?.toString() || "N/A";
          
          return (
            <div
              key={field.key}
              className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200/50"
            >
              <span className="text-sm font-medium text-gray-600">{field.label}</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Key Info Row - shows 4 primary fields prominently for quick scan
function KeyInfoRow({ service }: { service: ServiceData }) {
  const category = (service.category || "").toLowerCase();

  const fieldSets: { [key: string]: string[] } = {
    "dance-gym-yoga": ["instructorName", "feePerMonth", "trialClassAvailable", "city"],
    "language-classes": ["instructorName", "language", "feePerMonth", "city"],
    "tuition-classes": ["instructorName", "subject", "feePerMonth", "city"],
    "phones-tablets-accessories": ["brand", "model", "condition", "warranty"],
    "electronics-gadgets": ["brand", "model", "condition", "warranty"],
    "fashion-beauty": ["brand", "size", "color", "material"],
    "cars-bikes": ["brand", "model", "year", "kmDriven"],
    "rental-listings": ["propertyType", "bedrooms", "area", "furnished"],
  };

  const keys = fieldSets[category] || ["price", "city", "contactPerson", "phone"];

  const fmt = (k: string) => {
    const v = (service as any)[k];
    if (v === null || v === undefined || v === "") return "N/A";
    if (k.toLowerCase().includes("price") || k.toLowerCase().includes("fee") || k === "price") {
      const num = Number(v);
      if (!isNaN(num)) return `₹${num.toLocaleString("en-IN")}`;
    }
    if (k.toLowerCase().includes("date") || k.toLowerCase().includes("at")) {
      try {
        return new Date(v).toLocaleString();
      } catch { return String(v); }
    }
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return String(v);
  };

  const iconFor = (k: string) => {
    if (/instructor|trainer|teacher/i.test(k)) return <Users className="w-5 h-5 text-[#0B8457]" />;
    if (/price|fee|amount/i.test(k)) return <Star className="w-5 h-5 text-[#0B8457]" />;
    if (/city|area|location/i.test(k)) return <MapPin className="w-5 h-5 text-[#0B8457]" />;
    if (/phone|contact/i.test(k)) return <Phone className="w-5 h-5 text-[#0B8457]" />;
    return <Zap className="w-5 h-5 text-[#0B8457]" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {keys.map((k) => (
        <div key={k} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[#0B8457]/10 rounded-md">
              {iconFor(k)}
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">{k.replace(/([A-Z])/g, ' $1').replace(/_|\-/g,' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">{fmt(k)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component to render all fields of the service object for debugging/full info
function AllServiceFields({ service }: { service: ServiceData }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const formatKey = (k: string) =>
    k
      .replace(/([A-Z])/g, " $1")
      .replace(/_|\-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/(^|\s)\S/g, (t) => t.toUpperCase());

  const pretty = (v: any) => {
    try {
      if (v === null || v === undefined || v === "") return "N/A";
      if (typeof v === "boolean") return v ? "Yes" : "No";
      if (Array.isArray(v)) return v.length === 0 ? "None" : v.every((x) => typeof x !== "object") ? v.join(", ") : JSON.stringify(v, null, 2);
      if (typeof v === "object") return JSON.stringify(v, null, 2);
      return v.toString();
    } catch (e) {
      return String(v);
    }
  };

  const keys = Object.keys(service).sort();

  const handleCopy = async (key: string) => {
    const value = (service as any)[key];
    const text = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Full Service Data</h3>
          <div className="text-sm text-gray-500">{keys.length} fields</div>
        </div>

        <div className="flex items-center gap-3">
    
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded bg-[#0B8457] text-white hover:opacity-95 transition"
          >
            <ChevronRight className={`w-4 h-4 transform ${expanded ? "rotate-90" : "rotate-0"}`} />
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {showRaw && (
        <pre className="bg-gray-900 text-white p-4 rounded overflow-auto text-sm max-h-64">{JSON.stringify(service, null, 2)}</pre>
      )}

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keys.map((k) => (
            <div key={k} className="relative p-4 bg-white rounded-lg border border-gray-200">
              <div className="absolute right-3 top-3">
                <button
                  onClick={() => handleCopy(k)}
                  title="Copy value"
                  className="p-2 bg-gray-50 border border-gray-100 rounded-md hover:bg-gray-100 transition"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                {copiedKey === k && <div className="text-xs text-green-600 mt-1">Copied</div>}
              </div>

              <div className="pr-12">
                <div className="text-sm text-gray-500">{formatKey(k)}</div>
                <div className="mt-2 text-sm font-medium text-gray-900">{pretty((service as any)[k])}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function ServiceDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const endpoints = [
          `/api/services/${id}`,
          `/api/cars-bikes/${id}`,
          `/api/phones-tablets-accessories/${id}`,
          `/api/electronics-gadgets/${id}`,
          `/api/fashion-beauty/${id}`,
          `/api/skill-training/${id}`,
          `/api/tuition-classes/${id}`,
          `/api/health-wellness/${id}`,
          `/api/dance-gym-yoga/${id}`,
          `/api/language-classes/${id}`,
          `/api/academy-music-arts/${id}`,
          `/api/construction-materials/${id}`,
          `/api/rental-listings/${id}`,
          `/api/property-deals/${id}`,
          // Admin endpoints mirroring the public endpoints so details can be fetched from admin API
          `/api/admin/tuition-private-classes/${id}`,
          `/api/admin/cars-bikes/${id}`,
          `/api/admin/phones-tablets-accessories/${id}`,
          `/api/admin/electronics-gadgets/${id}`,
          `/api/admin/fashion-beauty/${id}`,
          `/api/admin/skill-training/${id}`,
          `/api/admin/health-wellness/${id}`,
          `/api/admin/dance-gym-yoga/${id}`,
          `/api/admin/language-classes/${id}`,
          `/api/admin/academy-music-arts/${id}`,
          `/api/admin/construction-materials/${id}`,
          `/api/admin/rental-listings/${id}`,
          `/api/admin/property-deals/${id}`,
        ];

        let data: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (!res.ok) continue;
            const json = await res.json();
            if (json && Object.keys(json).length) {
              data = json;
              break;
            }
          } catch (e) {
            // ignore and try next
            continue;
          }
        }

        if (data) {
          setService(data);
        } else {
          // Use mock data for demonstration
          console.log("Using mock data for ID:", id);
          setService({
            id: id || "",
            title: "Premium Service - " + (id ? String(id).slice(0, 8) : ""),
            category: "Services",
            price: 5000,
            priceType: "per service",
            rating: 4.8,
            reviews: 127,
            description:
              "Experience premium quality service with our professional team. We deliver excellence in every aspect of our work.",
            images: [
              "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            ],
            address: "123 Main Street, City, State 12345",
            phone: "+91 98765 43210",
            email: "contact@service.com",
            seller: {
              name: "Professional Services Co.",
              rating: 4.8,
              reviews: 256,
              responseTime: "Usually responds in 2 hours",
              verified: true,
            },
            features: [
              "Professional Team",
              "Quality Assured",
              "On-Time Delivery",
              "Competitive Pricing",
            ],
            highlights: [
              "10+ years of experience",
              "Trusted by 5000+ customers",
              "Available 24/7",
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        // Set mock data on error
        setService({
          id: id || "",
          title: "Service Details",
          category: "Services",
          price: 5000,
          priceType: "per service",
          rating: 4.8,
          reviews: 127,
          description: "Service description not available",
          images: [
            "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
          ],
          seller: {
            name: "Service Provider",
            rating: 4.8,
            reviews: 256,
            responseTime: "Usually responds in 2 hours",
            verified: true,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0B8457] rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading service details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Service Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-[#0B8457] hover:bg-[#059669] text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = service.images || [];
  const currentImage = images[currentImageIndex] || images[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inquiry sent:", { contactName, contactPhone, contactMessage });
    alert("Your inquiry has been sent successfully!");
    setContactName("");
    setContactPhone("");
    setContactMessage("");
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => setLocation("/")}
              className="text-[#0B8457] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>{service.category}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold truncate">
              {service.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200/50 shadow-sm h-96 group">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={service.title}
                    className="w-full h-full "
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Featured Badge */}
                {service.isFeatured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-4 py-2 rounded-full">
                    Featured
                  </div>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition-all duration-300"
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isFavorite ? "#ef4444" : "none"}
                      color={isFavorite ? "#ef4444" : "currentColor"}
                    />
                  </button>
                  <button className="bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        idx === currentImageIndex
                          ? "border-[#0B8457] shadow-md"
                          : "border-gray-200/50 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${service.title} ${idx + 1}`}
                        className="w-full h-full "
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Card */}
            <Card className="border-gray-200/50 bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Title and Rating */}
                <div className="space-y-3 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {service.rating}
                    </span>
                    <span className="text-gray-500">
                      ({service.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                {service.price && (
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-200">
                    <span className="text-4xl font-bold text-[#0B8457]">
                      ₹{service.price?.toLocaleString("en-IN")}
                    </span>
                    {service.priceType && (
                      <span className="text-gray-600">/{service.priceType}</span>
                    )}
                  </div>
                )}

                {/* Key info row - quick highlights */}
                <KeyInfoRow service={service} />

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About This Service
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  {service.highlights && service.highlights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Highlights</h4>
                      <div className="space-y-2">
                        {service.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#0B8457] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Features</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-3 bg-[#0B8457]/5 rounded-lg border border-[#0B8457]/10"
                          >
                            <Zap className="w-4 h-4 text-[#0B8457] flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category-Specific Fields */}
                  <CategorySpecificFields service={service} />

                  {/* Full raw/expanded service data - shows every field */}
                  <AllServiceFields service={service} />
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            {service.address && (
              <Card className="border-gray-200/50 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0B8457]" />
                    Location
                  </h3>
                  <p className="text-gray-600">{service.address}</p>
                  <button className="mt-4 text-[#0B8457] hover:underline font-medium text-sm flex items-center gap-1">
                    View on Map
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            {service.seller && (
              <Card className="border-gray-200/50 bg-white shadow-sm sticky top-24">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Seller Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {service.seller?.logo ? (
                            <img
                              src={service.seller.logo}
                              alt={service.seller?.name || 'Seller'}
                              className="w-full h-full "
                            />
                          ) : (
                            <div className="text-sm font-semibold text-gray-700">
                              {(service.seller?.name || 'S')
                                .split(' ')
                                .map((n) => n?.[0])
                                .filter(Boolean)
                                .slice(0, 2)
                                .join('')}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {service.seller.name}
                          </h3>
                          {service.seller.verified && (
                            <div className="flex items-center gap-1.5 mt-1 text-[#0B8457] text-sm font-medium">
                              <Shield className="w-4 h-4" />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="space-y-1.5 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900">
                          {service.seller.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {service.seller.reviews} reviews
                      </p>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {service.seller.responseTime}
                        </p>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="space-y-2 pt-2">
                      {service.phone && (
                        <a
                          href={`tel:${service.phone}`}
                          className="flex items-center justify-center gap-2 w-full bg-[#0B8457] hover:bg-[#059669] text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                        >
                          <Phone className="w-5 h-5" />
                          Call Now
                        </a>
                      )}
                      <button
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-300"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <Card className="border-gray-200/50 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Send Your Inquiry
                  </h4>
                  <form onSubmit={handleSendInquiry} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B8457]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B8457]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tell us what you need..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B8457]/20 resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0B8457] hover:bg-[#059669] text-white font-semibold py-2 rounded-lg transition-colors duration-300"
                    >
                      Send Inquiry
                    </button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-gray-200/50 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {service.createdAt && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Posted</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Views
                    </span>
                    <span className="font-semibold text-gray-900">1,234</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Inquiries
                    </span>
                    <span className="font-semibold text-gray-900">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="border-amber-200/50 bg-amber-50 shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Safety Tips
                </h4>
                <ul className="space-y-2 text-xs text-amber-800">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Verify seller credentials before proceeding</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Meet in public places for transactions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Check service quality before payment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
