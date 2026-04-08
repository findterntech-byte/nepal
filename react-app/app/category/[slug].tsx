import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  useColorScheme, ActivityIndicator, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { categoriesApi } from '@/services/api';

const PASTEL_PAIRS = [
  { bg: '#FEE2E2', icon: '#EF4444' },
  { bg: '#DBEAFE', icon: '#3B82F6' },
  { bg: '#D1FAE5', icon: '#10B981' },
  { bg: '#FEF9C3', icon: '#EAB308' },
  { bg: '#FCE7F3', icon: '#EC4899' },
  { bg: '#EDE9FE', icon: '#8B5CF6' },
  { bg: '#CCFBF1', icon: '#14B8A6' },
  { bg: '#FEF3C7', icon: '#F59E0B' },
];

export default function CategoryDetailScreen() {
  const isDark = useColorScheme() === 'dark';
  const { slug } = useLocalSearchParams();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const res = await categoriesApi.getAll();
        return res.data || [];
      } catch { return []; }
    },
  });

  const category = categories.find((c: any) => c.slug === slug);
  const subcategories = category?.subcategories?.filter((s: any) => s.isActive !== false) || [];

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : '#fff' }]}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : Colors.text} />
          </TouchableOpacity>
        </SafeAreaView>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : '#fff' }]}>
        <SafeAreaView edges={['top']} style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.border} />
          <Text style={[styles.emptyText, { color: isDark ? Colors.textDark : Colors.text }]}>Category not found</Text>
          <TouchableOpacity style={styles.backBtnDark} onPress={() => router.back()}>
            <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : '#fff' }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: isDark ? Colors.surfaceDark : '#fff' }}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#fff' : Colors.text }]} numberOfLines={1}>
            {category.name}
          </Text>
          <View style={{ width: 40 }} /> {/* Spacer to balance the header */}
        </View>
      </SafeAreaView>

      <FlatList
        data={subcategories}
        keyExtractor={(s: any) => String(s.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: sub, index }: { item: any, index: number }) => {
          const colors = PASTEL_PAIRS[index % PASTEL_PAIRS.length];
          return (
            <TouchableOpacity
              style={[styles.listItem, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}
              onPress={() => router.push(`/subcategory/${sub.slug}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                <Ionicons name={index % 2 === 0 ? "prism" : "layers"} size={20} color={colors.icon} />
              </View>
              <View style={styles.itemTextWrap}>
                <Text style={[styles.itemTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                  {sub.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#4B5563' : '#D1D5DB'} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={60} color={Colors.textMuted} />
            <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>No subcategories available</Text>
          </View>
        }
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (Spacing.base * 2) - 16) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeHeader: { paddingHorizontal: Spacing.base, paddingTop: 10 },
  headerTopRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'transparent'
  },
  iconBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { 
    flex: 1,
    fontSize: 18, 
    fontFamily: 'Poppins_600SemiBold', 
    textAlign: 'center',
  },
  
  listContent: {
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextWrap: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 22,
  },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 100 },
  emptyText: { fontSize: Typography.size.base, fontFamily: 'Inter_400Regular', marginTop: 12 },
  backBtnDark: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
