import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useColorScheme, ActivityIndicator, Dimensions,
  Linking, Share,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, API_BASE_URL } from '@/constants/theme';
import { listingsApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { useWishlist } from '@/hooks/useWishlist';

const resolveUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};
import { Button } from '@/components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const extractImagesArray = (item: any): string[] => {
  let arr: string[] = [];
  if (item.images) {
    if (Array.isArray(item.images)) arr = item.images;
    else if (typeof item.images === 'string') {
      try {
        const parsed = JSON.parse(item.images);
        if (Array.isArray(parsed)) arr = parsed;
        else arr = [item.images];
      } catch (e) {
        arr = [item.images];
      }
    }
  } else if (item.imageUrl) arr = [item.imageUrl];
  else if (item.image) arr = [item.image];
  return arr.filter(Boolean);
};

export default function ListingDetailScreen() {
  const isDark = useColorScheme() === 'dark';
  const { type, id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);

  const { data: item, isLoading } = useQuery({
    queryKey: ['listing-detail', type, id],
    queryFn: async () => {
      const res = await listingsApi.getListingById(type as string, id as string);
      return res.data;
    },
  });

  const { isInWishlist, toggle: toggleWishlistHook } = useWishlist();
  const wishlistItemId = `${id}_${type}`;
  const isSaved = isInWishlist(wishlistItemId);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    const title = item.title || item.name || item.schoolName || item.brandName || 'Listing';
    const price = item.price || item.monthlyRent || item.askingPrice;
    
    await toggleWishlistHook({
      id: wishlistItemId,
      listingId: String(id),
      listingType: String(type),
      title: title,
      price: price,
      location: item.location || item.city || item.district,
      image: resolveUrl(extractImagesArray(item)[0] || item.imageUrl || item.image),
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this listing: ${item.title || item.name} on Nepal Classifieds`,
        url: `https://nepalclassifieds.com/listing/${type}/${id}`, // Replace with actual deep link
      });
    } catch {}
  };

  const openDialer = () => {
    if (item?.phone) Linking.openURL(`tel:${item.phone}`);
  };

  const openWhatsApp = () => {
    if (item?.phone) Linking.openURL(`whatsapp://send?phone=${item.phone}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <Text style={{ color: isDark ? Colors.textDark : Colors.text, fontFamily: 'Inter_500Medium' }}>
          Listing not found or has been removed.
        </Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  const images = extractImagesArray(item);
  const title = item.title || item.name || item.schoolName || item.brandName || 'Listing';
  const price = item.price || item.monthlyRent || item.askingPrice;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Ionicons name="share-social" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleToggleWishlist}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? Colors.primary : "#fff"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          {images.length > 0 ? (
            <>
              {/* Hero Image */}
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: resolveUrl(images[activeImage]) }}
                  style={{ width: SCREEN_WIDTH, height: 320 }}
                  contentFit="cover"
                  transition={300}
                />
              </View>

              {/* Thumbnails */}
              {images.length > 1 && (
                <View style={styles.thumbnailWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailScroll}
                  >
                    {images.map((img: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => setActiveImage(i)}
                        activeOpacity={0.8}
                        style={[
                          styles.thumbnailBtn,
                          activeImage === i && styles.thumbnailBtnActive
                        ]}
                      >
                        <Image
                          source={{ uri: resolveUrl(img) }}
                          style={styles.thumbnailImg}
                          contentFit="cover"
                        />
                        {activeImage !== i && <View style={styles.thumbnailOverlay} />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.imagePlaceholder, { width: SCREEN_WIDTH }]}>
              <MaterialCommunityIcons name="image-off" size={48} color={Colors.textMuted} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              {item.category && <Badge label={item.category} variant="primary" style={{ marginBottom: 8 }} />}
              <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>{title}</Text>
              {(item.location || item.city) && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.location}>{item.location || item.city}</Text>
                </View>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>NPR {Number(price || 0).toLocaleString()}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? Colors.borderDark : Colors.border }]} />

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            {item.description || 'No description provided.'}
          </Text>

          {/* Details / Specs based on type (simulated logic) */}
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text, marginTop: 24 }]}>Details</Text>
          <View style={styles.detailsGrid}>
            {item.condition && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={[styles.detailValue, { color: isDark ? Colors.textDark : Colors.text }]}>{item.condition}</Text>
              </View>
            )}
            {item.bedrooms && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bedrooms</Text>
                <Text style={[styles.detailValue, { color: isDark ? Colors.textDark : Colors.text }]}>{item.bedrooms}</Text>
              </View>
            )}
            {item.year && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Year</Text>
                <Text style={[styles.detailValue, { color: isDark ? Colors.textDark : Colors.text }]}>{item.year}</Text>
              </View>
            )}
            {item.mileage && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mileage</Text>
                <Text style={[styles.detailValue, { color: isDark ? Colors.textDark : Colors.text }]}>{item.mileage}</Text>
              </View>
            )}
            {/* Catch-all for other fields could go here */}
          </View>

          {/* Seller / Agency info */}
          <View style={[styles.sellerCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>
                {item.agency?.name?.[0] || item.user?.fullName?.[0] || 'S'}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={[styles.sellerName, { color: isDark ? Colors.textDark : Colors.text }]}>
                {item.agency?.name || item.user?.fullName || 'Verified Seller'}
              </Text>
              <Text style={styles.sellerJoined}>Member since {new Date(item.user?.createdAt || Date.now()).getFullYear()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Float CTA Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surface, borderTopColor: isDark ? Colors.borderDark : Colors.border }]}>
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: Colors.secondary }]} onPress={openDialer}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.ctaText}>Call Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: '#25D366' }]} onPress={openWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.ctaText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerActions: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', zIndex: 10,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  galleryContainer: { backgroundColor: Colors.surfaceDark },
  heroImageContainer: { height: 320, backgroundColor: Colors.divider },
  thumbnailWrapper: { backgroundColor: '#fff' },
  thumbnailScroll: { padding: 12, gap: 10 },
  thumbnailBtn: { width: 70, height: 70, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbnailBtnActive: { borderColor: Colors.primary },
  thumbnailImg: { width: '100%', height: '100%' },
  thumbnailOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.4)' },
  imagePlaceholder: { height: 320, alignItems: 'center', justifyContent: 'center' },
  infoSection: { padding: Spacing.xl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 22, fontFamily: 'Poppins_700Bold', lineHeight: 30, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  priceContainer: { alignItems: 'flex-end', backgroundColor: 'rgba(232, 64, 64, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.lg },
  priceLabel: { color: Colors.primary, fontSize: 11, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  price: { color: Colors.primary, fontSize: 18, fontFamily: 'Poppins_700Bold' },
  divider: { height: 1, marginVertical: Spacing.xl },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: Spacing.md },
  description: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  detailItem: { width: '45%' },
  detailLabel: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 2 },
  detailValue: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  sellerCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, borderRadius: Radius.lg, marginTop: 32, borderWidth: 1, borderColor: Colors.border },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.secondaryLight, alignItems: 'center', justifyContent: 'center' },
  sellerInitial: { color: '#fff', fontSize: 20, fontFamily: 'Poppins_700Bold' },
  sellerInfo: { flex: 1, marginLeft: 12 },
  sellerName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  sellerJoined: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.base, paddingBottom: 30, borderTopWidth: 1 },
  ctaButtons: { flexDirection: 'row', gap: 12 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Radius.full, gap: 8 },
  ctaText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
