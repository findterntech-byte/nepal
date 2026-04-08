import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  useColorScheme, ActivityIndicator, RefreshControl, TextInput, Modal,
  FlatList, Dimensions, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.base * 2 - Spacing.sm) / 2;

const CATEGORIES = [
  {
    id: 'real-estate',
    label: '🏠 Real Estate',
    icon: 'business-outline',
    color: '#10B981',
    bg: '#D1FAE5',
    subcategories: [
      { name: 'Residential Properties', route: '/listing/real-estate' },
      { name: 'Commercial Properties', route: '/listing/commercial' },
      { name: 'Office Spaces', route: '/listing/office' },
      { name: 'Industrial Land', route: '/listing/industrial' },
      { name: 'Rental Rooms/Flats', route: '/listing/rental' },
      { name: 'Hostel & PG', route: '/listing/hostel' },
      { name: 'Property Deals', route: '/listing/deals' },
    ],
  },
  {
    id: 'vehicles',
    label: '🚗 Vehicles',
    icon: 'car-outline',
    color: '#3B82F6',
    bg: '#DBEAFE',
    subcategories: [
      { name: 'Cars & Bikes', route: '/listing/cars-bikes' },
      { name: 'Second Hand Vehicles', route: '/listing/second-hand-cars' },
      { name: 'Car & Bike Rentals', route: '/listing/car-rentals' },
      { name: 'Heavy Equipment', route: '/listing/heavy-equipment' },
      { name: 'Showrooms', route: '/listing/showrooms' },
      { name: 'Vehicle License', route: '/listing/vehicle-license' },
    ],
  },
  {
    id: 'electronics',
    label: '💻 Electronics',
    icon: 'laptop-outline',
    color: '#8B5CF6',
    bg: '#EDE9FE',
    subcategories: [
      { name: 'Electronics & Gadgets', route: '/listing/electronics' },
      { name: 'Phones & Tablets', route: '/listing/phones' },
      { name: 'Second Hand Phones', route: '/listing/second-phones' },
      { name: 'Computer Repair', route: '/listing/computer-repair' },
      { name: 'Cyber Cafe', route: '/listing/cyber-cafe' },
      { name: 'Service Centre', route: '/listing/service-centre' },
    ],
  },
  {
    id: 'education',
    label: '🎓 Education',
    icon: 'school-outline',
    color: '#F59E0B',
    bg: '#FEF3C7',
    subcategories: [
      { name: 'Tuition & Classes', route: '/listing/tuition' },
      { name: 'Dance, Gym & Yoga', route: '/listing/dance' },
      { name: 'Language Classes', route: '/listing/language' },
      { name: 'Skill Training', route: '/listing/skill-training' },
      { name: 'Schools & Colleges', route: '/listing/schools' },
      { name: 'E-Books & Courses', route: '/listing/ebooks' },
    ],
  },
  {
    id: 'fashion',
    label: '👗 Fashion',
    icon: 'shirt-outline',
    color: '#EC4899',
    bg: '#FCE7F3',
    subcategories: [
      { name: 'Fashion & Beauty', route: '/listing/fashion' },
      { name: 'Jewelry & Accessories', route: '/listing/jewelry' },
      { name: 'Saree & Clothing', route: '/listing/saree' },
    ],
  },
  {
    id: 'furniture',
    label: '🛋 Furniture',
    icon: 'bed-outline',
    color: '#14B8A6',
    bg: '#CCFBF1',
    subcategories: [
      { name: 'Furniture & Decor', route: '/listing/furniture' },
    ],
  },
  {
    id: 'services',
    label: '⚙️ Services',
    icon: 'construct-outline',
    color: '#F97316',
    bg: '#FFEDD5',
    subcategories: [
      { name: 'Household Services', route: '/listing/household' },
      { name: 'Health & Wellness', route: '/listing/health' },
      { name: 'Pharmacy & Medical', route: '/listing/pharmacy' },
      { name: 'Event Decoration', route: '/listing/event' },
      { name: 'Construction Materials', route: '/listing/construction' },
    ],
  },
  {
    id: 'skilled-labour',
    label: '🔧 Skilled Labour',
    icon: 'hammer-outline',
    color: '#6366F1',
    bg: '#E0E7FF',
    subcategories: [
      { name: 'Find Workers', route: '/listing/skilled-workers' },
      { name: 'Post Labour Job', route: '/listing/labour-job' },
    ],
  },
];

const QUICK_ACTIONS = [
  { icon: 'add-circle-outline', title: 'Post New Ad', sub: 'Create a new listing', color: '#10B981', bg: '#D1FAE5', route: '/seller-dashboard-new' },
  { icon: 'list-outline', title: 'My Listings', sub: 'Manage your ads', color: '#3B82F6', bg: '#DBEAFE', route: '/my-listings' },
  { icon: 'heart-outline', title: 'Wishlist', sub: 'Saved items', color: '#EF4444', bg: '#FEE2E2', route: '/wishlist' },
  { icon: 'chatbox-outline', title: 'Messages', sub: 'Buyer inquiries', color: '#8B5CF6', bg: '#EDE9FE', route: '/messages' },
  { icon: 'analytics-outline', title: 'Analytics', sub: 'View performance', color: '#F59E0B', bg: '#FEF3C7', route: '/analytics' },
  { icon: 'settings-outline', title: 'Settings', sub: 'Account & profile', color: '#6B7280', bg: '#F3F4F6', route: '/settings' },
];

export default function SellerDashboard() {
  const isDark = useColorScheme() === 'dark';
  const { user, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const { data: myListings } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await userApi.getMyListings();
      return res.data || [];
    },
  });

  const stats = {
    listings: myListings?.length || 0,
    active: myListings?.filter((l: any) => l.status === 'active').length || 0,
    views: myListings?.reduce((sum: number, l: any) => sum + (l.views || 0), 0) || 0,
  };

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const cardBg = isDark ? Colors.cardDark : '#fff';
  const textColor = isDark ? '#fff' : Colors.text;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondary;

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subcategories.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const selectedCategory = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={22} color={textColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: textColor }]}>Seller Dashboard</Text>
            <Text style={[styles.headerSub, { color: textSecondary }]}>Manage your listings</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.headerBtn}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Welcome Card */}
        <LinearGradient colors={[Colors.primary, '#0A3D20']} style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'S'}
              </Text>
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeLabel}>Welcome back,</Text>
              <Text style={styles.welcomeName} numberOfLines={1}>
                {user?.fullName || user?.username || 'Seller'}
              </Text>
                <View style={styles.welcomeStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{stats.listings}</Text>
                  <Text style={styles.statLabel}>Listings</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{stats.active}</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{stats.views}</Text>
                  <Text style={styles.statLabel}>Views</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickActionCard, { backgroundColor: cardBg }]}
              activeOpacity={0.8}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={[styles.quickActionTitle, { color: textColor }]}>{action.title}</Text>
              <Text style={styles.quickActionSub}>{action.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Categories */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Post New Ad</Text>
        <View style={[styles.searchWrap, { backgroundColor: cardBg }]}>
          <Ionicons name="search-outline" size={18} color={textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search categories..."
            placeholderTextColor={textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: cardBg }]}
              onPress={() => {
                setActiveCategory(cat.id);
                setShowCategoryModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <Text style={[styles.categoryName, { color: textColor }]} numberOfLines={1}>
                {cat.label.replace(/[^\w\s]/g, '')}
              </Text>
              <Text style={styles.categoryCount}>{cat.subcategories.length} options</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* All Subcategories List */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: Spacing.lg }]}>All Listing Types</Text>
        {filteredCategories.map((cat) => (
          <View key={cat.id} style={[styles.subCatSection, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.subCatHeader}
              onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              <View style={[styles.subCatIcon, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon as any} size={18} color={cat.color} />
              </View>
              <Text style={[styles.subCatTitle, { color: textColor }]}>{cat.label}</Text>
              <Text style={styles.subCatBadge}>{cat.subcategories.length}</Text>
              <Ionicons
                name={activeCategory === cat.id ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={textSecondary}
              />
            </TouchableOpacity>

            {activeCategory === cat.id && (
              <View style={styles.subCatList}>
                {cat.subcategories.map((sub, si) => (
                  <TouchableOpacity
                    key={si}
                    style={[styles.subItem, si < cat.subcategories.length - 1 && styles.subItemBorder]}
                    onPress={() => router.push(sub.route as any)}
                  >
                    <View style={styles.subItemDot} />
                    <Text style={[styles.subItemText, { color: textColor }]}>{sub.name}</Text>
                    <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {selectedCategory?.label}
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalSubtitle, { color: textSecondary }]}>
                Select a listing type to create your ad
              </Text>

              {selectedCategory?.subcategories.map((sub, si) => (
                <TouchableOpacity
                  key={si}
                  style={[styles.modalItem, { backgroundColor: isDark ? Colors.backgroundDark : '#F9FAFB' }]}
                  onPress={() => {
                    setShowCategoryModal(false);
                    router.push(sub.route as any);
                  }}
                >
                  <View style={[styles.modalItemIcon, { backgroundColor: selectedCategory?.bg }]}>
                    <Ionicons name="add-outline" size={18} color={selectedCategory?.color} />
                  </View>
                  <View style={styles.modalItemText}>
                    <Text style={[styles.modalItemTitle, { color: textColor }]}>{sub.name}</Text>
                    <Text style={styles.modalItemSub}>Tap to post ad →</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  scroll: { padding: Spacing.base, paddingBottom: 30 },

  welcomeCard: {
    borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.lg,
  },
  welcomeContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
  avatarWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold', textTransform: 'uppercase' },
  welcomeText: { flex: 1 },
  welcomeLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Inter_400Regular' },
  welcomeName: { color: '#fff', fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  welcomeStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
  statItem: { alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 16, fontFamily: 'Poppins_700Bold' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.3)' },

  sectionTitle: { fontSize: 17, fontFamily: 'Poppins_600SemiBold', marginBottom: 12 },

  quickActions: { paddingRight: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.lg },
  quickActionCard: {
    width: 100, padding: Spacing.base, borderRadius: Radius.lg,
    alignItems: 'center', ...Shadow.sm,
  },
  quickActionIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  quickActionTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  quickActionSub: { fontSize: 10, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', textAlign: 'center' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: Radius.lg, marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },

  categoriesGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Spacing.sm, marginBottom: Spacing.lg,
  },
  categoryCard: {
    width: CARD_WIDTH, padding: Spacing.base, borderRadius: Radius.lg,
    alignItems: 'center', ...Shadow.sm,
  },
  categoryIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  categoryName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: 2 },
  categoryCount: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },

  subCatSection: {
    borderRadius: Radius.lg, marginBottom: Spacing.sm, overflow: 'hidden',
    ...Shadow.sm,
  },
  subCatHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: Spacing.sm,
  },
  subCatIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  subCatTitle: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  subCatBadge: {
    backgroundColor: Colors.primary + '22', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
    fontSize: 11, color: Colors.primary, fontFamily: 'Inter_600SemiBold',
    marginRight: 4,
  },
  subCatList: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  subItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: Spacing.base, gap: Spacing.sm,
  },
  subItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
  subItemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  subItemText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    padding: Spacing.lg, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  modalSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: Spacing.base },
  modalItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, borderRadius: Radius.lg, marginBottom: Spacing.sm,
  },
  modalItemIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalItemText: { flex: 1, marginLeft: Spacing.sm },
  modalItemTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  modalItemSub: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
});
