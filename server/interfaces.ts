
import type { 
  User, 
  Property, 
  AdminCategory, 
  AdminSubcategory,
  Agency,
  Location,
  PropertyCategory,
  Faq
} from "../shared/schema";

export interface CategoryWithSubcategories extends AdminCategory {
  subcategories: AdminSubcategory[];
}

export interface PropertyWithRelations extends Property {
  location?: Location;
  category?: PropertyCategory;
  agency?: Agency;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
