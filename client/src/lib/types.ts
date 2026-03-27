import type { Property, Agency, Location, PropertyCategory, Faq } from "@shared/schema";

export interface PropertyWithRelations extends Property {
  location?: Location;
  category?: PropertyCategory;
  agency?: Agency;
}

export interface SearchFilters {
  locationId?: string;
  categoryId?: string;
  subcategoryId?: string;
  agencyId?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  isFeatured?: boolean;
  search?: string;
  priceType?: string;
}

export interface GlobalLocation {
  name: string;
  country: string;
  image: string;
  propertyCount?: number;
}

export interface Stats {
  totalProperties: number;
  totalAgencies: number;
  totalLocations: number;
  featuredProperties: number;
}
