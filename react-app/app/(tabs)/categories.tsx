import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, useColorScheme, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { categoriesApi } from '@/services/api';
import { Skeleton } from '@/components/ui/Skeleton';

const PASTEL_PAIRS = [
  { bg: '#FEE2E2', icon: '#EF4444' },
  { bg: '#DBEAFE', icon: '#3B82F6' },
  { bg: '#D1FAE5', icon: '#10B981' },
  { bg: '#FEF9C3', icon: '#EAB308' },
  { bg: '#FCE7F3', icon: '#EC4899' },
  { bg: '#EDE9FE', icon: '#8B5CF6' },
  { bg: '#CCFBF1', icon: '#14B8A6' },
  { bg: '#FEF3C7', icon: '#F59E0B' },
  { bg: '#E0F2FE', icon: '#0284C7' },
  { bg: '#F0FDF4', icon: '#16A34A' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'real-estate': 'home-city',
  'real-estate-property': 'home-city',
  'vehicles': 'car',
  'vehicles-transportation': 'car-sport',
  'education': 'school',
  'education-learning': 'book-education',
  'electronics': 'laptop',
  'electronics-technology': 'monitor',
  'fashion': 'hanger',
  'fashion-lifestyle': 'hanger',
  'furniture': 'sofa',
  'furniture-home-decor': 'sofa',
  'skilled-labour': 'briefcase',
  'skilled-labor': 'briefcase-account',
  'health-wellness': 'heart-pulse',
  'construction-materials': 'hammer-wrench',
  'jewelry-accessories': 'diamond-stone',
  'services': 'wrench',
  'default': 'tag-multiple',
};

function getIconForCategory(slug: string, name: string): string {
  const normalized = (slug || name || '').toLowerCase().replace(/[\s&]/g, '-').replace(/--+/g, '-');
  return CATEGORY_ICONS[normalized] || CATEGORY_ICONS[normalized.split('-')[0]] || CATEGORY_ICONS['default'];
}

export default function CategoriesScreen() {
  const isDark = useColorScheme() === 'dark';
  const [search, setSearch] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const res = await categoriesApi.getAll();
        return res.data || [];
      } catch { return []; }
    },
  });

  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  const filtered = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.subcategories || []).some((s: any) => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surface }]}>
        <Text style={[styles.headerTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Categories</Text>
        <Text style={styles.headerSub}>Explore {categories.length} segments of Jeevika</Text>
        
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? Colors.textDark : Colors.text }]}
            placeholder="Search categories..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.gridContainer}>
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <View key={i} style={[styles.gridCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
                  <Skeleton width={64} height={64} borderRadius={32} style={{ marginBottom: 16 }} />
                  <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
                  <Skeleton width="40%" height={12} />
                </View>
              ))
            : filtered.map((cat: any, idx: number) => {
                const colors = PASTEL_PAIRS[idx % PASTEL_PAIRS.length];
                const iconName = getIconForCategory(cat.slug, cat.name);
                const subcatsCount = (cat.subcategories || []).filter((s: any) => s.isActive !== false).length;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.gridCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}
                    onPress={() => router.push(`/category/${cat.slug}`)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.catIcon, { backgroundColor: colors.bg }]}>
                      <MaterialCommunityIcons name={iconName as any} size={32} color={colors.icon} />
                    </View>
                    <Text style={[styles.catName, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                      {cat.name}
                    </Text>
                    {subcatsCount > 0 && (
                      <Text style={styles.catSub}>{subcatsCount} types</Text>
                    )}
                  </TouchableOpacity>
                );
              })
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins_700Bold', marginBottom: 2 },
  headerSub: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F7F5',
    borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: 16,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (SCREEN_WIDTH - 32 - 16) / 2, // 2 columns, padding 16*2, gap 16
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    ...Shadow.sm,
  },
  catIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  catName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: 4 },
  catSub: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular' },
});
