import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  useColorScheme, ActivityIndicator, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, API_BASE_URL } from '@/constants/theme';
import { searchApi } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { LinearGradient } from 'expo-linear-gradient';

const resolveUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const extractImage = (item: any) => {
  if (item.imageUrl) return item.imageUrl;
  if (item.image) return item.image;
  if (item.images) {
    if (Array.isArray(item.images)) return item.images[0];
    if (typeof item.images === 'string') {
      try {
        const arr = JSON.parse(item.images);
        if (Array.isArray(arr) && arr.length > 0) return arr[0];
      } catch (e) {
        if (item.images.startsWith('http') || item.images.startsWith('/')) return item.images;
      }
    }
  }
  return null;
};

export default function SearchScreen() {
  const isDark = useColorScheme() === 'dark';
  const params = useLocalSearchParams();
  const [query, setQuery] = useState((params.q as string) || '');
  const [submittedQuery, setSubmittedQuery] = useState((params.q as string) || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', submittedQuery, minPrice, maxPrice, page],
    queryFn: async () => {
      if (!submittedQuery.trim()) return { results: [], total: 0 };
      try {
        const res = await searchApi.search({
          q: submittedQuery.trim(),
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page,
          limit: 20,
        });
        return res.data || { results: [], total: 0 };
      } catch { return { results: [], total: 0 }; }
    },
    enabled: submittedQuery.length > 0,
  });

  const results = data?.results || [];

  const handleSearch = () => {
    setSubmittedQuery(query);
    setPage(1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.primary }]}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.searchBar, { backgroundColor: isDark ? Colors.cardDark : '#fff' }]}>
            <Ionicons name="search" size={18} color={Colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? Colors.textDark : Colors.text }]}
              placeholder="Search listings..."
              placeholderTextColor={Colors.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setSubmittedQuery(''); }}>
                <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={22} color={showFilters ? Colors.primary : '#fff'} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={[styles.filtersRow, { backgroundColor: isDark ? Colors.cardDark : '#fff', borderRadius: Radius.lg, marginTop: 8 }]}>
            <View style={styles.priceFilter}>
              <Text style={[styles.filterLabel, { color: isDark ? Colors.textDark : Colors.text }]}>Min Price (NPR)</Text>
              <TextInput
                style={[styles.priceInput, { borderColor: isDark ? Colors.borderDark : Colors.border, color: isDark ? Colors.textDark : Colors.text }]}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceFilter}>
              <Text style={[styles.filterLabel, { color: isDark ? Colors.textDark : Colors.text }]}>Max Price (NPR)</Text>
              <TextInput
                style={[styles.priceInput, { borderColor: isDark ? Colors.borderDark : Colors.border, color: isDark ? Colors.textDark : Colors.text }]}
                placeholder="Any"
                placeholderTextColor={Colors.textMuted}
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.applyBtn} onPress={handleSearch}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Results Info */}
      {submittedQuery && !isLoading && (
        <View style={styles.resultsInfo}>
          <Text style={[styles.resultsText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            {results.length > 0
              ? `${data?.total || results.length} results for "${submittedQuery}"`
              : `No results for "${submittedQuery}"`}
          </Text>
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: Colors.textSecondary, marginTop: 12, fontFamily: 'Inter_400Regular' }}>Searching...</Text>
        </View>
      )}

      {/* Empty state */}
      {!submittedQuery && !isLoading && (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={80} color={Colors.border} />
          <Text style={[styles.emptyTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Search anything</Text>
          <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>
            Search for properties, cars, classes, services and more across Nepal
          </Text>
          {/* Quick Search Tags */}
          <View style={styles.tagsRow}>
            {['Property', 'Cars', 'Education', 'Fashion', 'Electronics'].map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, { backgroundColor: isDark ? Colors.cardDark : Colors.surface }]}
                onPress={() => { setQuery(tag); setSubmittedQuery(tag); }}
              >
                <Text style={[styles.tagText, { color: Colors.primary }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item: any) => `${item.type}-${item.id}`}
          contentContainerStyle={{ padding: Spacing.base, gap: 12 }}
          renderItem={({ item }: { item: any }) => {
            const imgUrl = extractImage(item);
            return (
              <TouchableOpacity
                style={[styles.resultCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
                onPress={() => router.push(`/listing/${item.type}/${item.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  {imgUrl ? (
                    <Image source={{ uri: resolveUrl(imgUrl) }} style={styles.resultImage} contentFit="cover" transition={300} />
                  ) : (
                    <View style={[styles.resultImage, styles.resultImagePlaceholder]}>
                      <Ionicons name="image-outline" size={40} color={Colors.textMuted} />
                    </View>
                  )}
                  {item.category && (
                    <Badge label={item.category} variant="primary" style={styles.categoryBadge} />
                  )}
                  <View style={styles.favoriteBtn}>
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                  </View>
                </View>
                <View style={styles.resultContent}>
                  <View style={styles.titlePriceRow}>
                    <Text style={[styles.resultTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={1}>
                      {item.title || item.name || 'Listing'}
                    </Text>
                    {item.price && (
                      <Text style={styles.resultPrice}>NPR {Number(item.price).toLocaleString()}</Text>
                    )}
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={Colors.textSecondary} />
                    <Text style={styles.resultLocation}>{item.location || item.city || 'Nepal'}</Text>
                    {item.condition && (
                      <>
                        <View style={styles.dotSeparator} />
                        <Text style={styles.resultCondition}>{item.condition}</Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* No results */}
      {!isLoading && submittedQuery && results.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="search-circle-outline" size={80} color={Colors.border} />
          <Text style={[styles.emptyTitle, { color: isDark ? Colors.textDark : Colors.text }]}>No results found</Text>
          <Text style={[styles.emptyText]}>Try different keywords or browse by category</Text>
          <TouchableOpacity
            style={[styles.browseCatBtn]}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.browseCatText}>Browse Categories</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { padding: 4 },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, paddingHorizontal: 12, paddingVertical: 8, gap: 8,
  },
  searchInput: { flex: 1, fontSize: Typography.size.base, fontFamily: 'Inter_400Regular' },
  filterToggle: { padding: 8, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.15)' },
  filterToggleActive: { backgroundColor: '#fff' },
  filtersRow: { padding: Spacing.md, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  priceFilter: { flex: 1 },
  filterLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  priceInput: {
    borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 6,
    fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular',
  },
  priceDivider: { width: 1, height: 36, backgroundColor: Colors.border, alignSelf: 'flex-end', marginBottom: 2 },
  applyBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md,
  },
  applyText: { color: '#fff', fontSize: Typography.size.sm, fontFamily: 'Inter_600SemiBold' },
  resultsInfo: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  resultsText: { fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: Typography.size.xl, fontFamily: 'Poppins_600SemiBold', marginTop: 16, marginBottom: 8 },
  emptyText: { color: Colors.textSecondary, fontSize: Typography.size.base, textAlign: 'center', fontFamily: 'Inter_400Regular', lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20, justifyContent: 'center' },
  tag: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: Colors.primary },
  tagText: { fontSize: Typography.size.sm, fontFamily: 'Inter_500Medium' },
  resultCard: { flexDirection: 'column', borderRadius: 20, overflow: 'hidden', marginBottom: Spacing.lg }, // Premium curve
  imageContainer: { width: '100%', height: 240, position: 'relative' },
  resultImage: { width: '100%', height: '100%' }, // Stunning large image
  resultImagePlaceholder: { backgroundColor: Colors.divider, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { position: 'absolute', top: 12, left: 12 },
  favoriteBtn: { position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  resultContent: { padding: 16, paddingTop: 14, gap: 6 }, // More breathing room
  titlePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  resultTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold', lineHeight: 24 },
  resultPrice: { color: Colors.primary, fontSize: 16, fontFamily: 'Poppins_700Bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultLocation: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, marginHorizontal: 4 },
  resultCondition: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_500Medium' },
  browseCatBtn: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.lg },
  browseCatText: { color: '#fff', fontSize: Typography.size.base, fontFamily: 'Inter_600SemiBold' },
});
