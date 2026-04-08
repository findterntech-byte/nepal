import { Platform } from 'react-native';

// API Configuration
export const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000' 
  : 'http://localhost:5000';

// App Colors - Jeevika Brand
export const Colors = {
  primary: '#0F4D2A',       // Jeevika dark green
  primaryDark: '#0A331C',
  primaryLight: '#1B7C46',
  secondary: '#F5A623',     // Warm earthy gold
  secondaryLight: '#FBCB7B',
  accent: '#F5A623',        // Gold/Featured
  accentLight: '#FCD34D',

  // Backgrounds
  background: '#F8F9FA',
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  card: '#FFFFFF',
  cardDark: '#243044',
  
  // Text
  text: '#1A1A2E',
  textDark: '#F1F5F9',
  textSecondary: '#64748B',
  textSecondaryDark: '#94A3B8',
  textMuted: '#94A3B8',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI
  border: '#E2E8F0',
  borderDark: '#334155',
  divider: '#F1F5F9',
  dividerDark: '#1E293B',
  
  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',

  // Tab Bar
  tabBar: '#FFFFFF',
  tabBarDark: '#1E293B',
  tabActive: '#0F4D2A',
  tabInactive: '#94A3B8',

  // Category Pastel Colors (for category cards)
  pastel: [
    '#FEE2E2', '#DBEAFE', '#D1FAE5', '#FEF9C3',
    '#FCE7F3', '#EDE9FE', '#CCFBF1', '#FEF3C7',
  ],
  pastelIcon: [
    '#EF4444', '#3B82F6', '#10B981', '#EAB308',
    '#EC4899', '#8B5CF6', '#14B8A6', '#F59E0B',
  ],
};

// Typography
export const Typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    poppinsRegular: 'Poppins_400Regular',
    poppinsMedium: 'Poppins_500Medium',
    poppinsSemiBold: 'Poppins_600SemiBold',
    poppinsBold: 'Poppins_700Bold',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// Border Radius
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  primary: {
    shadowColor: '#0F4D2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Category Icons mapping (using @expo/vector-icons MaterialCommunityIcons)
export const CategoryIconMap: Record<string, string> = {
  'real-estate': 'home-city',
  'real-estate-property': 'home-city',
  'vehicles': 'car',
  'vehicles-transportation': 'car',
  'education': 'school',
  'education-learning': 'school',
  'electronics': 'laptop',
  'electronics-technology': 'laptop',
  'fashion': 'tshirt-crew',
  'fashion-lifestyle': 'tshirt-crew',
  'furniture': 'sofa',
  'furniture-home-decor': 'sofa',
  'skilled-labour': 'briefcase',
  'health-wellness': 'heart-pulse',
  'construction-materials': 'brick',
  'jewelry-accessories': 'diamond-stone',
  'default': 'tag',
};
