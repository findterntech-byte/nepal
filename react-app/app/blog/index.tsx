import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  useColorScheme, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { blogApi } from '@/services/api';
import { Badge } from '@/components/ui/Badge';

export default function BlogScreen() {
  const isDark = useColorScheme() === 'dark';

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const res = await blogApi.getPosts();
        return res.data || [];
      } catch { return []; }
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog & Articles</Text>
        <Text style={styles.headerSub}>Tips, guides, and news</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={{ padding: Spacing.base, gap: 16 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.md]}
              onPress={() => router.push(`/blog/${item.slug}`)}
              activeOpacity={0.85}
            >
              <View style={styles.imageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={300} />
                ) : (
                  <View style={[styles.image, { backgroundColor: Colors.divider }]} />
                )}
                {item.category && (
                  <View style={styles.badgeWrapper}>
                    <Badge label={item.category} variant="primary" />
                  </View>
                )}
              </View>
              <View style={styles.content}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.date}>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Just now'}</Text>
                </View>
                <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.excerpt, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]} numberOfLines={3}>
                  {item.summary || item.content?.replace(/<[^>]+>/g, '').substring(0, 100) + '...'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.base, paddingBottom: Spacing.lg },
  backBtn: { alignSelf: 'flex-start', paddingBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 24, fontFamily: 'Poppins_700Bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: Radius.xl, overflow: 'hidden' }, // Premium radius
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 200 }, // Larger image
  badgeWrapper: { position: 'absolute', top: 16, right: 16 },
  content: { padding: Spacing.xl }, // More breathing room
  date: { color: Colors.textSecondary, fontSize: 13, fontFamily: 'Inter_500Medium' },
  title: { fontSize: 20, fontFamily: 'Poppins_700Bold', lineHeight: 28, marginBottom: 12 },
  excerpt: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 24 },
});
