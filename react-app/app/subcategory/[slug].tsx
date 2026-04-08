import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  useColorScheme, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, API_BASE_URL } from '@/constants/theme';
import { listingsApi } from '@/services/api';
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

export default function SubcategoryScreen() {
  const isDark = useColorScheme() === 'dark';
  const { slug } = useLocalSearchParams();
  const title = (slug as string).replace(/-/g, ' ');

  const resolveTableForSubcategory = (rawSlug: string) => {
    if (!rawSlug) return '';
    const slugStr = rawSlug.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    // This exact map covers almost all endpoints defined in the web app's subcategory-mapping.ts
    const map: Record<string, string> = {
      'e-books-online-courses': 'ebooks-online-courses', // <--- Fixes E-Books
      'ebooks-online-courses': 'ebooks-online-courses',
      'tuition-private-classes': 'tuition-private-classes',
      'rental-rooms-flats-apartments': 'rental-listings',
      'rental-listings': 'rental-listings',
      'hostel-pg': 'hostel-listings',
      'hostels-pg': 'hostel-listings',
      'residential-properties': 'properties',
      'construction-materials': 'construction-materials',
      'construction-building-materials': 'construction-materials',
      'property-deals': 'property-deals-public',
      'commercial-properties': 'commercial-properties-public',
      'industrial-land': 'industrial-land-public',
      'local-market-commercial-property': 'commercial-properties-public',
      'office-spaces': 'office-spaces-public',
      'company-office-space': 'office-spaces-public',
      'cars-bikes': 'cars-bikes',
      'heavy-equipment': 'heavy-equipment',
      'heavy-equipment-for-sale': 'heavy-equipment',
      'showrooms': 'showrooms',
      'showrooms-authorized-second-hand': 'showrooms',
      'second-hand-cars-bikes': 'second-hand-cars-bikes',
      'car-bike-rentals': 'car-bike-rentals',
      'transportation-moving-services': 'transportation-moving-services',
      'vehicle-license-classes': 'vehicle-license-classes',
      'electronics-gadgets': 'electronics-gadgets',
      'phones-tablets-accessories': 'phones-tablets-accessories',
      'new-phones-tablets-accessories': 'phones-tablets-accessories',
      'second-hand-phones-tablets-accessories': 'second-hand-phones-tablets-accessories',
      'second-hand-phones-accessories': 'second-hand-phones-tablets-accessories',
      'computer-mobile-laptop-repair-services': 'computer-mobile-laptop-repair-services',
      'cyber-cafe-internet-services': 'cyber-cafe-internet-services',
      'telecommunication-services': 'telecommunication-services',
      'service-centre-warranty': 'service-centre-warranty',
      'furniture-interior-decor': 'admin/furniture-interior-decor',
      'household-services': 'household-services',
      'event-decoration-services': 'event-decoration-services',
      'fashion-beauty-products': 'fashion-beauty-products',
      'saree-clothing-shopping': 'saree-clothing-shopping',
      'cricket-sports-training': 'cricket-sports-training',
      'pharmacy-medical-stores': 'pharmacy-medical-stores',
      'dance-karate-gym-yoga': 'dance-karate-gym-yoga',
      'language-classes': 'language-classes',
      'academies-music-arts-sports': 'academy-music-arts',
      'skill-training-certification': 'skill-training-certification',
      'schools-colleges-coaching': 'admin/schools-colleges-coaching',
      'schools-colleges-coaching-institutes': 'admin/schools-colleges-coaching',
      'educational-consultancy-study-abroad': 'educational-consultancy-study-abroad',
      'jewelry-accessories': 'jewelry-accessories',
      'health-wellness-services': 'health-wellness-services',
    };
    return map[slugStr] || slugStr;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['subcategory', slug],
    queryFn: async () => {
      try {
        const table = resolveTableForSubcategory(slug as string);
        const res = await listingsApi.getByTable(table, { limit: 50 });
        const items = res.data?.items || res.data?.results || res.data || [];
        return Array.isArray(items) ? items : [];
      } catch { return []; }
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.primary }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.headerSub}>{data?.length || 0} listings available</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : data?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color={Colors.border} />
          <Text style={[styles.emptyText, { color: isDark ? Colors.textDark : Colors.text }]}>No listings found in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={{ padding: Spacing.base, paddingBottom: 60 }}
          renderItem={({ item }: { item: any }) => {
            const imgUrl = extractImage(item);
            return (
              <TouchableOpacity
                style={[styles.resultCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
                onPress={() => {
                  const table = resolveTableForSubcategory(slug as string);
                  router.push(`/listing/${table}/${item.id}`)
                }}
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
                  {item.featured && (
                    <Badge label="Featured" variant="accent" style={styles.featuredBadge} />
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
                    {(item.price || item.monthlyRent) && (
                      <Text style={styles.resultPrice}>NPR {Number(item.price || item.monthlyRent).toLocaleString()}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 24, fontFamily: 'Poppins_700Bold', textTransform: 'capitalize' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { fontSize: Typography.size.base, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 12 },
  resultCard: { flexDirection: 'column', borderRadius: 20, overflow: 'hidden', marginBottom: Spacing.lg }, // Premium curve
  imageContainer: { width: '100%', height: 240, position: 'relative' },
  resultImage: { width: '100%', height: '100%' }, // Stunning large image
  resultImagePlaceholder: { backgroundColor: Colors.divider, alignItems: 'center', justifyContent: 'center' },
  featuredBadge: { position: 'absolute', top: 12, left: 12 },
  favoriteBtn: { position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  resultContent: { padding: 16, paddingTop: 14, gap: 6 }, // More breathing room
  titlePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  resultTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold', lineHeight: 24 },
  resultPrice: { color: Colors.primary, fontSize: 16, fontFamily: 'Poppins_700Bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultLocation: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, marginHorizontal: 4 },
  resultCondition: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_500Medium' },
});
