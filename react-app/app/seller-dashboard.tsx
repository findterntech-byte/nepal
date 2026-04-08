import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useColorScheme, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, sellerDashboardApi } from '@/services/api';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'real-estate': 'business-outline',
  'vehicles': 'car-outline',
  'education': 'school-outline',
  'electronics': 'laptop-outline',
  'fashion': 'shirt-outline',
  'furniture': 'bed-outline',
  'skilled-labour': 'construct-outline',
  'health-wellness': 'fitness-outline',
  'default': 'cube-outline',
};

function getCategoryIcon(slug: string, name: string): keyof typeof Ionicons.glyphMap {
  const key = (slug || name || '').toLowerCase().replace(/[\s&]/g, '-');
  return CATEGORY_ICONS[key] || CATEGORY_ICONS[key.split('-')[0]] || CATEGORY_ICONS['default'];
}

export default function SellerDashboard() {
  const isDark = useColorScheme() === 'dark';
  const { user, logout } = useAuth();
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const userId = user?.id;

  // ── Fetch user's chosen categories ─────────────────────────────────
  const { data: rawCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['seller-categories', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const res = await categoriesApi.getUserCategories(userId!);
        return res.data || [];
      } catch { return []; }
    },
  });

  // ── Fetch dashboard stats ───────────────────────────────────────────
  const { data: dashStats } = useQuery({
    queryKey: ['seller-dashboard-stats', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const res = await sellerDashboardApi.getStats(userId!);
        return res.data || {};
      } catch { return {}; }
    },
  });

  const categories = rawCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: getCategoryIcon(c.slug, c.name),
    subcategories: (c.subcategories || []).filter((s: any) => s.isActive !== false),
  }));

  const totalListings = dashStats?.totalListings ?? 0;
  const activeListings = dashStats?.activeListings ?? 0;
  const totalViews = dashStats?.totalViews ?? 0;
  const featuredListings = dashStats?.featuredListings ?? 0;

  const stats = [
    { label: 'Total Listings', value: totalListings, icon: 'list-outline', color: '#10B981', bg: '#D1FAE5' },
    { label: 'Active Listings', value: activeListings, icon: 'checkmark-circle-outline', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Total Views', value: totalViews, icon: 'eye-outline', color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Featured', value: featuredListings, icon: 'star-outline', color: '#F59E0B', bg: '#FEF3C7' },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const toggleCat = (id: string) =>
    setExpandedCats(p => ({ ...p, [id]: !p[id] }));

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const cardBg = isDark ? Colors.cardDark : '#fff';
  const textColor = isDark ? '#fff' : Colors.text;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.iconBtn}>
          <Ionicons name="home-outline" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Welcome Card ── */}
        <LinearGradient colors={[Colors.primary, '#0A3D20']} style={styles.welcomeCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'S'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName} numberOfLines={1}>
              {user?.fullName || user?.username || 'Pro Seller'}
            </Text>
            <TouchableOpacity style={styles.postAdBtn} onPress={() => router.push('/(tabs)/post-ad')}>
              <Ionicons name="add" size={14} color={Colors.primary} />
              <Text style={styles.postAdText}> Post New Ad</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Stats Grid ── */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Analytics & Reports</Text>
        <Text style={[styles.sectionSub, { color: Colors.textSecondary }]}>Real-time performance metrics for your listings</Text>
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: cardBg }]}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: textColor }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── My Categories (chosen at signup) ── */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 8 }]}>My Categories</Text>
        <Text style={[styles.sectionSub, { color: Colors.textSecondary }]}>
          Categories &amp; subcategories you selected during registration
        </Text>

        {catsLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text style={{ color: Colors.textSecondary, marginLeft: 8, fontFamily: 'Inter_400Regular' }}>
              Loading your categories...
            </Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: cardBg }]}>
            <Ionicons name="folder-open-outline" size={40} color={Colors.textMuted} />
            <Text style={{ color: Colors.textSecondary, marginTop: 10, fontFamily: 'Inter_500Medium', textAlign: 'center' }}>
              No categories found.{'\n'}Please update your profile.
            </Text>
          </View>
        ) : (
          categories.map((cat: any, idx: number) => {
            const isOpen = !!expandedCats[cat.id];
            const pastelColor = Colors.pastel[idx % Colors.pastel.length];
            const iconColor = Colors.pastelIcon[idx % Colors.pastelIcon.length];
            return (
              <View key={cat.id} style={[styles.catBlock, { backgroundColor: cardBg }]}>
                <TouchableOpacity
                  style={styles.catHeader}
                  onPress={() => toggleCat(cat.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.catIconWrap, { backgroundColor: pastelColor }]}>
                    <Ionicons name={cat.icon} size={18} color={iconColor} />
                  </View>
                  <Text style={[styles.catName, { color: textColor }]}>{cat.name}</Text>
                  <View style={styles.subBadge}>
                    <Text style={styles.subBadgeText}>{cat.subcategories.length}</Text>
                  </View>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textMuted}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>

                {isOpen && cat.subcategories.length > 0 && (
                  <View style={styles.subList}>
                    {cat.subcategories.map((sub: any, si: number) => (
                      <View
                        key={sub.id}
                        style={[
                          styles.subItem,
                          si < cat.subcategories.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' }
                        ]}
                      >
                        <View style={styles.subDot} />
                        <Text style={[styles.subName, { color: isDark ? Colors.textDark : Colors.textSecondary }]}>
                          {sub.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {isOpen && cat.subcategories.length === 0 && (
                  <View style={styles.subList}>
                    <Text style={{ color: Colors.textMuted, fontFamily: 'Inter_400Regular', fontSize: 13, paddingVertical: 8 }}>
                      No subcategories
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* ── Quick Actions ── */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 16 }]}>Manage</Text>

        {[
          { icon: 'documents-outline', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', title: 'My Ads', sub: 'View and edit your published ads', route: '/(tabs)/profile' },
          { icon: 'person-outline', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', title: 'Public Profile', sub: 'Manage how buyers see you', route: '/(tabs)/profile' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.actionRow, { backgroundColor: cardBg }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, { color: textColor }]}>{item.title}</Text>
              <Text style={styles.actionSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.actionRow, { backgroundColor: cardBg }]} onPress={handleLogout}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(107,114,128,0.1)' }]}>
            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          </View>
          <View style={styles.actionText}>
            <Text style={[styles.actionTitle, { color: textColor }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
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
  iconBtn: { padding: 6 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  scroll: { padding: Spacing.base },

  welcomeCard: {
    padding: Spacing.xl, borderRadius: Radius.xl,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    marginBottom: Spacing.xl, ...Shadow.lg,
  },
  avatarCircle: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold', textTransform: 'uppercase' },
  welcomeLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular' },
  welcomeName: { color: '#fff', fontSize: 19, fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  postAdBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radius.full, alignSelf: 'flex-start',
  },
  postAdText: { color: Colors.primary, fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  sectionTitle: { fontSize: 17, fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
  sectionSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 14 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '4%', marginBottom: Spacing.lg },
  statCard: {
    width: '48%', padding: Spacing.lg, borderRadius: Radius.lg,
    marginBottom: 12, ...Shadow.sm,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  statIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 2 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_500Medium' },

  loadingBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 24 },
  emptyBox: {
    alignItems: 'center', padding: 32, borderRadius: Radius.lg,
    marginBottom: 16, ...Shadow.sm,
  },

  catBlock: {
    borderRadius: Radius.lg, marginBottom: 12,
    ...Shadow.sm, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  catHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 14,
  },
  catIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  catName: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  subBadge: {
    backgroundColor: Colors.primary + '22', borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  subBadgeText: { fontSize: 12, color: Colors.primary, fontFamily: 'Inter_700Bold' },

  subList: {
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: Spacing.base, paddingBottom: 8, paddingTop: 4,
  },
  subItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
  },
  subDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.primary, marginRight: 10, opacity: 0.7,
  },
  subName: { fontSize: 14, fontFamily: 'Inter_400Regular' },

  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 12, ...Shadow.sm,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1, marginLeft: 14 },
  actionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  actionSub: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
});
