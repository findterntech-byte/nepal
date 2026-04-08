import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  useColorScheme, ActivityIndicator, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, API_BASE_URL } from '@/constants/theme';
import { userApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

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

const STATUS_COLORS: Record<string, string> = {
  active: Colors.success,
  pending: Colors.warning,
  sold: Colors.textMuted,
  expired: Colors.error,
};

export default function MyListingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending'>('all');

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const cardBg = isDark ? Colors.cardDark : Colors.card;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondary;

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await userApi.getMyListings();
      return res.data || [];
    },
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await userApi.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      Alert.alert('Success', 'Listing deleted successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete listing');
    },
  });

  const filteredListings = listings?.filter((item: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'pending') return item.status === 'pending';
    return true;
  }) || [];

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>My Listings</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={64} color={Colors.textMuted} />
          <Text style={[styles.loginText, { color: textColor }]}>Please login to view your listings</Text>
          <Button title="Login" onPress={() => router.push('/auth/login')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Listings</Text>
        <TouchableOpacity onPress={() => router.push('/seller-dashboard-new')} style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: cardBg }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: textColor }]}>{listings?.length || 0}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: Colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: Colors.success }]}>
            {listings?.filter((l: any) => l.status === 'active').length || 0}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: Colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: Colors.warning }]}>
            {listings?.filter((l: any) => l.status === 'pending').length || 0}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['all', 'active', 'pending'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: Colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? Colors.primary : textSecondary }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredListings.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="document-text-outline" size={64} color={Colors.border} />
          <Text style={[styles.emptyText, { color: textColor }]}>No listings found</Text>
          <Button
            title="Post Your First Ad"
            onPress={() => router.push('/seller-dashboard-new')}
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={{ padding: Spacing.base, paddingBottom: 40 }}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }: { item: any }) => {
            const imgUrl = extractImage(item);
            const statusColor = STATUS_COLORS[item.status] || Colors.textMuted;
            
            return (
              <View style={[styles.card, { backgroundColor: cardBg }, Shadow.md]}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => router.push(`/listing/${item.tableName || 'unknown'}/${item.id}`)}
                  activeOpacity={0.9}
                >
                  <View style={styles.imageWrap}>
                    {imgUrl ? (
                      <Image source={{ uri: resolveUrl(imgUrl) }} style={styles.image} contentFit="cover" />
                    ) : (
                      <View style={[styles.image, styles.imagePlaceholder]}>
                        <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
                      </View>
                    )}
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <Text style={styles.statusText}>{item.status || 'active'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.info}>
                    <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                      {item.title || item.name || 'Untitled'}
                    </Text>
                    <Text style={[styles.price, { color: Colors.primary }]}>
                      NPR {Number(item.price || item.monthlyRent || 0).toLocaleString()}
                    </Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="location-outline" size={12} color={textSecondary} />
                      <Text style={styles.location}>{item.location || item.city || 'Nepal'}</Text>
                    </View>
                    <Text style={styles.date}>
                      {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.actions, { borderTopColor: Colors.border }]}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/listing/${item.tableName || 'unknown'}/${item.id}`)}>
                    <Ionicons name="eye-outline" size={18} color={Colors.info} />
                    <Text style={[styles.actionText, { color: Colors.info }]}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="create-outline" size={18} color={Colors.warning} />
                    <Text style={[styles.actionText, { color: Colors.warning }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      Alert.alert('Delete Listing', 'Are you sure you want to delete this listing?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
                      ]);
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.base,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  addBtn: { padding: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loginText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  emptyText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: Spacing.base, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: Radius.lg, ...Shadow.sm,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, height: 40 },
  
  tabs: { flexDirection: 'row', marginHorizontal: Spacing.base, marginTop: Spacing.base },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  
  card: { borderRadius: Radius.lg, marginBottom: Spacing.base, overflow: 'hidden', ...Shadow.md },
  cardContent: { flexDirection: 'row', padding: Spacing.base },
  imageWrap: { width: 100, height: 100, borderRadius: Radius.md, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { backgroundColor: Colors.divider, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase' },
  
  info: { flex: 1, marginLeft: Spacing.base, justifyContent: 'center' },
  title: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  price: { fontSize: 16, fontFamily: 'Poppins_700Bold', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  date: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: 4 },
  
  actions: {
    flexDirection: 'row', borderTopWidth: 1,
    paddingVertical: 8, paddingHorizontal: Spacing.base,
  },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  actionText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
});
