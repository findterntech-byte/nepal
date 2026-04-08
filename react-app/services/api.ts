import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/theme';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { email: username, password }),
  register: (data: any) =>
    api.post('/api/auth/register', data),
  logout: () =>
    api.post('/api/auth/logout'),
  getMe: () =>
    api.get('/api/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),
};

// ─── Categories APIs ──────────────────────────────────
export const categoriesApi = {
  getAll: () =>
    api.get('/api/admin/categories'),
  getFeatured: () =>
    api.get('/api/admin/categories?featured=true'),
  // Fetch only the categories/subcategories the user chose (seller-dashboard)
  getUserCategories: (userId: string | number) =>
    api.get(`/api/admin/categories?userId=${userId}&role=user`),
};

// ─── Seller Dashboard APIs ────────────────────────────
export const sellerDashboardApi = {
  getStats: (userId: string | number) =>
    api.get(`/api/dashboard?userId=${userId}&role=user`),
};

// ─── Listings APIs ────────────────────────────────────
export const listingsApi = {
  getSliders: (pageType = 'Home') =>
    api.get(`/api/sliders?pageType=${pageType}`),
  getSliderCards: () =>
    api.get('/api/slider-cards'),
  getProperties: (params?: any) =>
    api.get('/api/properties', { params }),
  getCarsBikes: (params?: any) =>
    api.get('/api/cars-bikes', { params }),
  getSecondHandCarsBikes: (params?: any) =>
    api.get('/api/second-hand-cars-bikes', { params }),
  getCarBikeRentals: (params?: any) =>
    api.get('/api/car-bike-rentals', { params }),
  getFashionBeauty: (params?: any) =>
    api.get('/api/fashion-beauty', { params }),
  getElectronicsGadgets: (params?: any) =>
    api.get('/api/electronics-gadgets', { params }),
  getPhonesTablets: (params?: any) =>
    api.get('/api/phones-tablets-accessories', { params }),
  getFurnitureDecor: (params?: any) =>
    api.get('/api/furniture-interior-decor', { params }),
  getJewelryAccessories: (params?: any) =>
    api.get('/api/jewelry-accessories', { params }),
  getConstructionMaterials: (params?: any) =>
    api.get('/api/construction-materials', { params }),
  getHouseholdServices: (params?: any) =>
    api.get('/api/household-services', { params }),
  getHealthWellness: (params?: any) =>
    api.get('/api/health-wellness', { params }),
  getPharmacy: (params?: any) =>
    api.get('/api/pharmacy', { params }),
  getRentalListings: (params?: any) =>
    api.get('/api/rental-listings', { params }),
  getHostelListings: (params?: any) =>
    api.get('/api/hostel-listings', { params }),
  getSkillTraining: (params?: any) =>
    api.get('/api/skill-training', { params }),
  getTuitionClasses: (params?: any) =>
    api.get('/api/tuition-classes', { params }),
  getDanceGymYoga: (params?: any) =>
    api.get('/api/dance-gym-yoga', { params }),
  getLanguageClasses: (params?: any) =>
    api.get('/api/language-classes', { params }),
  getHeavyEquipment: (params?: any) =>
    api.get('/api/heavy-equipment-public', { params }),
  getSareeClothing: (params?: any) =>
    api.get('/api/saree-clothing', { params }),
  getEventDecoration: (params?: any) =>
    api.get('/api/event-decoration', { params }),
  getByTable: (tableName: string, params?: any) =>
    api.get(`/api/${tableName}`, { params }),
  getListingById: (type: string, id: string) =>
    api.get(`/api/${type}/${id}`),
  createListing: (endpoint: string, data: any) =>
    api.post('/api/listings', { tableName: endpoint, ...data }),
};

// ─── Search API ───────────────────────────────────────
export const searchApi = {
  search: (params: { q?: string; category?: string; minPrice?: number; maxPrice?: number; location?: string; page?: number; limit?: number }) =>
    api.get('/api/search', { params }),
};

// ─── Blog APIs ────────────────────────────────────────
export const blogApi = {
  getPosts: (params?: any) =>
    api.get('/api/blog/posts', { params }),
  getPostBySlug: (slug: string) =>
    api.get(`/api/blog/posts/${slug}`),
};

// ─── Video APIs ───────────────────────────────────────
export const videosApi = {
  getFeatured: () =>
    api.get('/api/videos?featured=true'),
  getAll: () =>
    api.get('/api/videos'),
};

// ─── Wishlist APIs ────────────────────────────────────
export const wishlistApi = {
  get: () =>
    api.get('/api/user/wishlist'),
  add: (listingId: string, listingType: string) =>
    api.post('/api/user/wishlist', { listingId, listingType }),
  remove: (id: number) =>
    api.delete(`/api/user/wishlist/${id}`),
};

// ─── User APIs ────────────────────────────────────────
export const userApi = {
  getProfile: () =>
    api.get('/api/user/profile'),
  updateProfile: (data: any) =>
    api.put('/api/user/profile', data),
  getMyListings: () =>
    api.get('/api/user/listings'),
  deleteListing: (id: number) =>
    api.delete(`/api/user/listings/${id}`),
};

// ─── Skilled Labour ───────────────────────────────────
export const skilledLabourApi = {
  getAll: (params?: any) =>
    api.get('/api/skilled-labour', { params }),
  getById: (id: string) =>
    api.get(`/api/skilled-labour/${id}`),
};

export default api;
