import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, useColorScheme, RefreshControl, ActivityIndicator,
  TextInput, Alert
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow, API_BASE_URL } from '@/constants/theme';
import { categoriesApi, listingsApi, blogApi, videosApi, wishlistApi } from '@/services/api';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const resolveUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Category pastel color pairs
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

function HeroBanner() {
  const isDark = useColorScheme() === 'dark';
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ['sliders', 'Home'],
    queryFn: async () => {
      try {
        const res = await listingsApi.getSliders('Home');
        return res.data || [];
      } catch { return []; }
    },
  });

  const fallbackSlides = [
    { id: 1, title: 'Find Your Dream Property', subtitle: 'Browse thousands of listings across Nepal', gradient: ['#0F4D2A', '#1B7C46'] },
    { id: 2, title: 'Buy & Sell Vehicles', subtitle: 'Cars, bikes and more at great prices', gradient: ['#2563EB', '#60A5FA'] },
    { id: 3, title: 'Education & Training', subtitle: 'Discover classes and courses near you', gradient: ['#F5A623', '#FBCB7B'] },
  ];

  const slides = sliders.length > 0 ? sliders : fallbackSlides;

  if (isLoading) {
    return <Skeleton height={220} borderRadius={0} style={{ marginBottom: 4 }} />;
  }

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={(item: any) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIdx(idx);
        }}
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            {item.imageUrl ? (
              <>
                <Image
                  source={{ uri: resolveUrl(item.imageUrl) }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={300}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={StyleSheet.absoluteFillObject}
                />
              </>
            ) : (
              <LinearGradient
                colors={(item.gradient || ['#E84040', '#FF6B6B']) as [string, string]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <View style={styles.slideContent}>
              {item.badge && (
                <View style={styles.slideBadge}>
                  <Text style={styles.slideBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Text style={styles.slideTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
              )}
              {item.ctaText && (
                <TouchableOpacity style={styles.slideCTA}>
                  <Text style={styles.slideCTAText}>{item.ctaText}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_: any, i: number) => (
          <View
            key={i}
            style={[styles.dot, i === activeIdx && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function SearchBar() {
  const isDark = useColorScheme() === 'dark';
  return (
    <View style={[styles.searchBar, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surface }, Shadow.md]}>
      <Ionicons name="search" size={20} color={Colors.textSecondary} />
      <TouchableOpacity
        style={styles.searchInput}
        onPress={() => router.push('/search')}
        activeOpacity={0.7}
      >
        <Text style={[styles.searchPlaceholder, { color: Colors.textMuted }]}>
          Search properties, cars, services...
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={() => router.push('/search')}
      >
        <Ionicons name="options" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function CategoryGrid() {
  const isDark = useColorScheme() === 'dark';
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const res = await categoriesApi.getAll();
        return res.data || [];
      } catch { return []; }
    },
  });

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Skeleton width={140} height={20} />
        </View>
        <View style={styles.categoryGrid}>
          {Array(8).fill(0).map((_, i) => (
            <View key={i} style={styles.categorySkeletonWrapper}>
              <Skeleton width={70} height={70} borderRadius={18} style={{ marginBottom: 8 }} />
              <Skeleton width={60} height={12} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const displayCats = categories.slice(0, 8);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          Browse Categories
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryGrid}>
        {displayCats.map((cat: any, idx: number) => {
          const colors = PASTEL_PAIRS[idx % PASTEL_PAIRS.length];
          const iconName = getIconForCategory(cat.slug, cat.name);
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => router.push(`/category/${cat.slug}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.bg }]}>
                <MaterialCommunityIcons name={iconName as any} size={26} color={colors.icon} />
              </View>
              <Text
                style={[styles.categoryName, { color: isDark ? Colors.textDark : Colors.text }]}
                numberOfLines={2}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => router.push('/(tabs)/categories')}
          activeOpacity={0.8}
        >
          <View style={[styles.categoryIcon, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="grid" size={26} color={Colors.textSecondary} />
          </View>
          <Text style={[styles.categoryName, { color: Colors.textSecondary }]}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeaturedListings({ title, queryKey, fetchFn, type }: any) {
  const isDark = useColorScheme() === 'dark';
  const { isAuthenticated } = useAuth();
  
  const { data = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      try {
        const res = await fetchFn({ limit: 10 });
        const raw = res.data;
        if (Array.isArray(raw)) return raw;
        if (raw?.items) return raw.items;
        if (raw?.data) return raw.data;
        return [];
      } catch { return []; }
    },
  });

  const { isInWishlist, toggle: toggleWishlistHook } = useWishlist();

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Skeleton width={160} height={20} />
        </View>
        <FlatList
          data={Array(4).fill(0)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listingScroll}
          keyExtractor={(_, i) => String(i)}
          renderItem={() => <CardSkeleton />}
        />
      </View>
    );
  }

  if (!data.length) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listingScroll}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={[styles.listingCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
            onPress={() => router.push(`/listing/${type}/${item.id}`)}
            activeOpacity={0.9}
          >
            <View style={styles.listingImageContainer}>
              {item.images?.[0] || item.imageUrl || item.image ? (
                <Image
                  source={{ uri: resolveUrl(item.images?.[0] || item.imageUrl || item.image) }}
                  style={styles.listingImage}
                  contentFit="cover"
                  transition={300}
                />
              ) : (
                <View style={[styles.listingImage, styles.listingImagePlaceholder]}>
                  <MaterialCommunityIcons name="image-off" size={32} color={Colors.textMuted} />
                </View>
              )}
              {/* Premium Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                style={StyleSheet.absoluteFillObject}
              />
              {/* Wishlist Button */}
              {(() => {
                const wishlistItemId = `${item.id}_${type}`;
                const isWishlisted = isInWishlist(wishlistItemId);
                
                const toggleWishlist = async () => {
                  if (!isAuthenticated) return Alert.alert('Login Required', 'Please login to save items to your wishlist.');
                  try {
                    await toggleWishlistHook({
                      id: wishlistItemId,
                      listingId: String(item.id),
                      listingType: type,
                      title: item.title || item.name || item.brandName || 'Listing',
                      price: item.price || item.monthlyRent || item.askingPrice,
                      location: item.location || item.city || item.district,
                      image: resolveUrl(item.images?.[0] || item.imageUrl || item.image),
                    });
                  } catch (err) {
                    console.log('Wishlist error', err);
                  }
                };
                
                return (
                  <TouchableOpacity 
                    style={[styles.heartBtn, { backgroundColor: isWishlisted ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.3)' }]} 
                    activeOpacity={0.7}
                    onPress={toggleWishlist}
                  >
                     <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={16} color={isWishlisted ? Colors.primary : "#fff"} />
                  </TouchableOpacity>
                );
              })()}
              
              {item.featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>PRO</Text>
                </View>
              )}
              
              {/* Floating Price */}
              {(item.price || item.monthlyRent || item.askingPrice) && (
                <View style={styles.floatingPrice}>
                  <Text style={styles.floatingPriceText}>
                    NPR {Number(item.price || item.monthlyRent || item.askingPrice || 0).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.listingCardContent}>
              <Text style={[styles.listingTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                {item.title || item.name || item.schoolName || item.brandName || 'Listing'}
              </Text>
              {(item.location || item.city || item.district) && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={14} color={Colors.textMuted} />
                  <Text style={styles.listingLocation} numberOfLines={1}>
                    {item.location || item.city || item.district}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function StatsSection() {
  const isDark = useColorScheme() === 'dark';
  const stats = [
    { value: '50K+', label: 'Listings', icon: 'format-list-bulleted' },
    { value: '25K+', label: 'Users', icon: 'account-group' },
    { value: '100+', label: 'Categories', icon: 'view-grid' },
    { value: '77', label: 'Districts', icon: 'map-marker' },
  ];
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={styles.statsContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {stats.map((s, i) => (
        <View key={i} style={styles.statItem}>
          <MaterialCommunityIcons name={s.icon as any} size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.statValue}>{s.value}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </LinearGradient>
  );
}

function BlogPreview() {
  const isDark = useColorScheme() === 'dark';
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-home'],
    queryFn: async () => {
      try {
        const res = await blogApi.getPosts({ limit: 4 });
        return res.data || [];
      } catch { return []; }
    },
  });

  if (!posts.length && !isLoading) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          Top Articles
        </Text>
        <TouchableOpacity onPress={() => router.push('/blog')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts.slice(0, 4)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listingScroll}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={[styles.blogCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
            onPress={() => router.push(`/blog/${item.slug}`)}
            activeOpacity={0.9}
          >
            <View style={styles.blogImageContainer}>
              {item.imageUrl ? (
                <Image source={{ uri: resolveUrl(item.imageUrl) }} style={styles.blogImage} contentFit="cover" transition={300} />
              ) : (
                <View style={[styles.blogImage, { backgroundColor: Colors.divider }]} />
              )}
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={StyleSheet.absoluteFillObject} />
              {item.category && (
                <View style={{ position: 'absolute', bottom: 8, left: 8 }}>
                  <Badge label={item.category} variant="primary" size="sm" />
                </View>
              )}
            </View>
            <View style={styles.blogContent}>
              <Text style={[styles.blogTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.blogMetaRow}>
                <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.blogDate}>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Just now'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function VideosPreview() {
  const isDark = useColorScheme() === 'dark';
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['home-videos'],
    queryFn: async () => {
      try {
        const res = await videosApi.getFeatured();
        return res.data || [];
      } catch { return []; }
    },
  });

  if (!videos.length && !isLoading) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          Featured Videos
        </Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={videos.slice(0, 5)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listingScroll}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={[styles.listingCard, { width: 260 }, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
            activeOpacity={0.9}
          >
            <View style={styles.listingImageContainer}>
              {item.thumbnailUrl ? (
                <Image source={{ uri: resolveUrl(item.thumbnailUrl) }} style={[styles.listingImage, { width: 260 }]} contentFit="cover" transition={300} />
              ) : (
                <View style={[styles.listingImage, { width: 260, backgroundColor: Colors.divider }]} />
              )}
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFillObject} />
              <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -24 }, { translateY: -24 }] }}>
                 <Ionicons name="play-circle" size={48} color="#fff" />
              </View>
            </View>
            <View style={styles.listingCardContent}>
              <Text style={[styles.listingTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surface }]}>
          <View style={[styles.headerTop, { marginBottom: 12, alignItems: 'center' }]}>
            <Image 
              source={require('@/assets/logo.png')} 
              style={{ width: 120, height: 70, marginLeft: -4 }} 
              contentFit="contain" 
            />
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,77,42,0.08)' }]} onPress={() => router.push('/search')}>
                <Ionicons name="search" size={22} color={isDark ? '#fff' : Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,77,42,0.08)' }]} onPress={() => router.push('/(tabs)/wishlist')}>
                <Ionicons name="heart-outline" size={22} color={isDark ? '#fff' : Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <SearchBar />
        </View>

        {/* Hero Banner */}
        <HeroBanner />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Properties */}
        <FeaturedListings
          title="🏠 Properties"
          queryKey="home-properties"
          fetchFn={listingsApi.getProperties}
          type="properties"
        />

        {/* Stats */}
        <StatsSection />

        {/* Cars & Bikes */}
        <FeaturedListings
          title="🚗 Vehicles"
          queryKey="home-vehicles"
          fetchFn={listingsApi.getCarsBikes}
          type="cars-bikes"
        />

        {/* Second Hand Cars & Bikes */}
        <FeaturedListings
          title="🚘 Second Hand Cars & Bikes"
          queryKey="home-second-hand-cars"
          fetchFn={listingsApi.getSecondHandCarsBikes}
          type="second-hand-cars-bikes"
        />

        {/* Electronics & Gadgets */}
        <FeaturedListings
          title="💻 Electronics & Gadgets"
          queryKey="home-electronics"
          fetchFn={listingsApi.getElectronicsGadgets}
          type="electronics-gadgets"
        />

        {/* Second Hand Phones & Tablets */}
        <FeaturedListings
          title="📱 Second Hand Phones & Tablets"
          queryKey="home-phones"
          fetchFn={listingsApi.getPhonesTablets}
          type="phones-tablets-accessories"
        />

        {/* Furniture & Interior Decor */}
        <FeaturedListings
          title="🛋️ Furniture & Interior Decor"
          queryKey="home-furniture"
          fetchFn={listingsApi.getFurnitureDecor}
          type="furniture-interior-decor"
        />

        {/* Fashion */}
        <FeaturedListings
          title="👗 Fashion & Beauty"
          queryKey="home-fashion"
          fetchFn={listingsApi.getFashionBeauty}
          type="fashion-beauty"
        />

        {/* E-Books & Online Courses */}
        <FeaturedListings
          title="📚 E-Books & Online Courses"
          queryKey="home-ebooks"
          fetchFn={(params: any) => listingsApi.getByTable('ebooks-online-courses', params)}
          type="ebooks-online-courses"
        />

        {/* Education */}
        <FeaturedListings
          title="🎓 Education"
          queryKey="home-education"
          fetchFn={listingsApi.getTuitionClasses}
          type="tuition-classes"
        />

        {/* Featured Videos */}
        <VideosPreview />

        {/* Blog Preview */}
        <BlogPreview />

        {/* Featured Articles & Research */}
        <FeaturedListings
          title="📰 Featured Articles & Research"
          queryKey="home-articles"
          fetchFn={(params: any) => listingsApi.getByTable('articles', params)}
          type="articles"
        />

        {/* CTA Banner */}
        <LinearGradient
          colors={[Colors.secondary, Colors.secondaryLight]}
          style={styles.ctaBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Have something to sell?</Text>
            <Text style={styles.ctaSubtitle}>Post your ad for free and reach thousands of buyers</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/post-ad')}>
              <Ionicons name="add-circle" size={18} color={Colors.secondary} />
              <Text style={styles.ctaBtnText}>Post Free Ad</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerGreeting: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  headerBrand: { color: Colors.text, fontSize: 22, fontFamily: 'Poppins_700Bold' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F7F5',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: 8, fontSize: 15 },
  searchPlaceholder: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  filterBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(15,77,42,0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: -4,
  },

  // Banner
  bannerContainer: { position: 'relative' },
  slide: {
    height: 220,
    overflow: 'hidden',
    position: 'relative',
  },
  slideContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  slideBadge: {
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  slideBadgeText: { color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  slideTitle: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  slideSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  slideCTA: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  slideCTAText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { width: 18, backgroundColor: Colors.primary },

  // Sections
  sectionContainer: { paddingTop: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.size.lg, fontFamily: 'Poppins_600SemiBold' },
  seeAll: { color: Colors.primary, fontSize: Typography.size.sm, fontFamily: 'Inter_600SemiBold' },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: 12,
  },
  categoryItem: {
    width: (SCREEN_WIDTH - 32 - 36) / 4,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 62, height: 62, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 10, fontFamily: 'Inter_500Medium',
    textAlign: 'center', lineHeight: 13,
  },
  categorySkeletonWrapper: {
    width: (SCREEN_WIDTH - 32 - 36) / 4,
    alignItems: 'center',
  },

  // Listing Cards
  listingScroll: { paddingHorizontal: Spacing.base, gap: 12 },
  listingCard: { width: 220, borderRadius: Radius.xl, overflow: 'hidden' }, // Slightly wider, larger border radius
  listingImageContainer: { position: 'relative' },
  listingImage: { width: 220, height: 160 }, // Larger image
  listingImagePlaceholder: {
    backgroundColor: Colors.divider,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: Colors.accent, borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  featuredText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  heartBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  floatingPrice: {
    position: 'absolute', bottom: 12, left: 12,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    ...Shadow.sm
  },
  floatingPriceText: { color: '#fff', fontSize: 14, fontFamily: 'Poppins_700Bold' },
  listingCardContent: { padding: 12 },
  listingTitle: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    paddingBottom: 6, lineHeight: 20,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listingLocation: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.xl,
    ...Shadow.primary,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold', marginTop: 4 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'Inter_400Regular' },

  // Blog
  blogCard: { width: 280, borderRadius: Radius.xl, overflow: 'hidden' }, // Wider premium card
  blogImageContainer: { position: 'relative' },
  blogImage: { width: 280, height: 160 },
  blogContent: { padding: 16 },
  blogTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', lineHeight: 22, marginBottom: Spacing.sm },
  blogMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  blogDate: { color: Colors.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular' },

  // CTA Banner
  ctaBanner: {
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  ctaContent: { alignItems: 'flex-start' },
  ctaTitle: { color: '#fff', fontSize: 20, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  ctaSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16, lineHeight: 20 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: Radius.full,
  },
  ctaBtnText: { color: Colors.secondary, fontSize: 14, fontFamily: 'Inter_700Bold' },
});
