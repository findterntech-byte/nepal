import { ArrowRight } from "lucide-react";
import type { GlobalLocation } from "@/lib/types";

const globalLocations: GlobalLocation[] = [
  {
    name: "UAE",
    country: "United Arab Emirates",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    name: "Philippines",
    country: "Philippines",
    image: "https://pixabay.com/get/g7e6143564ece3644c29f45b77b999f03db40d42f3a6108e39f94fc02027d72fda6779f11090920931258f91a9f4dadbae5a2cdfb9b9cfabe0920ad030234c7dd_1280.jpg",
  },
  {
    name: "Turkey",
    country: "Turkey",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    name: "United Kingdom",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    name: "Lebanon",
    country: "Lebanon",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    name: "Cyprus",
    country: "Cyprus",
    image: "https://images.unsplash.com/photo-1580837119756-563d608dd119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
];

export default function GlobalPropertiesSection() {
  return (
    <section className="py-16" data-testid="global-properties-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-global-title">
            Explore Properties Across the World
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-global-description">
            Take a deep dive and browse homes for sale, with original photos, excellent international locations
            and local insights to find what is right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalLocations.map((location) => (
            <div
              key={location.name}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
              data-testid={`card-location-${location.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div
                className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600"
                style={{
                  backgroundImage: `url('${location.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white text-foreground px-3 py-1 rounded-full font-medium" data-testid={`text-location-name-${location.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {location.name}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Explore More Card */}
          <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-primary to-blue-600" data-testid="card-explore-more">
            <div
              className="relative h-64 flex items-center justify-center"
              style={{
                backgroundImage: "linear-gradient(rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.8)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-2" data-testid="text-explore-more-title">Explore More</h3>
                <h3 className="text-xl font-bold mb-4" data-testid="text-explore-more-subtitle">International Properties</h3>
                <ArrowRight className="w-6 h-6 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
