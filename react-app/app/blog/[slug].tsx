import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useColorScheme, ActivityIndicator, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { blogApi } from '@/services/api';
import { Badge } from '@/components/ui/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// A very simple HTML stripper for blog content
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '');

export default function BlogDetailScreen() {
  const isDark = useColorScheme() === 'dark';
  const { slug } = useLocalSearchParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const res = await blogApi.getPostBySlug(slug as string);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
        <Text style={{ color: isDark ? Colors.textDark : Colors.text, fontFamily: 'Inter_500Medium' }}>
          Article not found.
        </Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={() => router.back()}>
          <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContainer}>
          {post.imageUrl ? (
            <Image source={{ uri: post.imageUrl }} style={styles.heroImage} contentFit="cover" transition={400} />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: Colors.primary }]} />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContent}>
            {post.category && (
              <Badge label={post.category} variant="primary" style={{ alignSelf: 'flex-start', marginBottom: 12 }} />
            )}
            <Text style={styles.heroTitle}>{post.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroDate}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Just now'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.text }]}>
            {post.content ? stripHtml(post.content) : post.summary}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    position: 'absolute', top: 16, left: 16, zIndex: 10,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroContainer: { position: 'relative', width: SCREEN_WIDTH, height: 350 },
  heroImage: { width: SCREEN_WIDTH, height: 350 },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl },
  heroTitle: { color: '#fff', fontSize: 28, fontFamily: 'Poppins_700Bold', lineHeight: 38 },
  heroDate: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter_500Medium' },
  content: { padding: Spacing.xl, paddingTop: Spacing.xl },
  body: { fontSize: 17, fontFamily: 'Inter_400Regular', lineHeight: 30 },
  backBtnFallback: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
