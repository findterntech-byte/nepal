import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, useColorScheme, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistScreen() {
  const isDark = useColorScheme() === 'dark';
  const { isAuthenticated } = useAuth();
  const { items, isLoading, remove } = useWishlist();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: Colors.primary }]}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={Colors.border} />
          <Text style={[styles.emptyTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
            Save your favourites
          </Text>
          <Text style={styles.emptyText}>Login to save and view your wishlist across devices</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginBtnText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.headerSub}>{items.length} saved items</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={Colors.border} />
          <Text style={[styles.emptyTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
            No saved items yet
          </Text>
          <Text style={styles.emptyText}>Browse listings and tap the heart icon to save</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/')}>
            <Text style={styles.loginBtnText}>Explore Listings</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={{ padding: Spacing.base, gap: 12 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
              onPress={() => router.push(`/listing/${item.listingType}/${item.listingId}`)}
              activeOpacity={0.85}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <MaterialCommunityIcons name="image-off" size={30} color={Colors.textMuted} />
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.price && (
                  <Text style={styles.cardPrice}>NPR {Number(item.price).toLocaleString()}</Text>
                )}
                {item.location && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.cardLocation}>{item.location}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => remove(item.id)}
              >
                <Ionicons name="heart" size={22} color={Colors.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  headerTitle: { color: '#fff', fontSize: 24, fontFamily: 'Poppins_700Bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing['2xl'] },
  emptyTitle: { fontSize: Typography.size.xl, fontFamily: 'Poppins_600SemiBold', marginTop: 16, marginBottom: 8 },
  emptyText: { color: Colors.textSecondary, fontSize: Typography.size.base, textAlign: 'center', fontFamily: 'Inter_400Regular', lineHeight: 22 },
  loginBtn: {
    marginTop: 24, backgroundColor: Colors.primary,
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: Radius.lg,
  },
  loginBtnText: { color: '#fff', fontSize: Typography.size.base, fontFamily: 'Inter_600SemiBold' },
  card: { flexDirection: 'row', borderRadius: Radius.lg, overflow: 'hidden' },
  cardImage: { width: 100, height: 100 },
  cardImagePlaceholder: { backgroundColor: Colors.divider, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, padding: 12 },
  cardTitle: { fontSize: Typography.size.base, fontFamily: 'Inter_500Medium', marginBottom: 4, lineHeight: 20 },
  cardPrice: { color: Colors.primary, fontSize: 15, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  cardLocation: { color: Colors.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular' },
  removeBtn: { padding: 12, justifyContent: 'flex-start' },
});
