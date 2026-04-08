import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORY_OPTIONS = [
  { id: 'real-estate', label: '🏠 Real Estate & Property', subcategories: ['Residential Properties', 'Commercial Properties', 'Office Spaces', 'Industrial Land', 'Rental - Rooms/Flats', 'Hostel & PG', 'Property Deals'] },
  { id: 'vehicles', label: '🚗 Vehicles & Transportation', subcategories: ['Cars & Bikes', 'Second Hand Cars & Bikes', 'Car & Bike Rentals', 'Heavy Equipment', 'Showrooms', 'Vehicle License Classes'] },
  { id: 'education', label: '🎓 Education & Learning', subcategories: ['Tuition & Private Classes', 'Dance, Karate, Gym & Yoga', 'Language Classes', 'Academies - Music, Arts, Sports', 'Skill Training & Certification', 'Schools, Colleges & Coaching', 'E-Books & Online Courses', 'Educational Consultancy'] },
  { id: 'electronics', label: '💻 Electronics & Technology', subcategories: ['Electronics & Gadgets', 'Phones, Tablets & Accessories', 'Computer & Mobile Repair', 'Cyber Cafe & Internet Services', 'Telecom Services', 'Service Centre & Warranty'] },
  { id: 'fashion', label: '👗 Fashion & Lifestyle', subcategories: ['Fashion & Beauty Products', 'Jewelry & Accessories', 'Saree & Clothing Shopping'] },
  { id: 'furniture', label: '🛋 Furniture & Home Decor', subcategories: ['Furniture & Interior Decor'] },
  { id: 'skilled-labour', label: '🔧 Skilled Labour', subcategories: ['Find Skilled Workers', 'Post Labour Job'] },
  { id: 'services', label: '⚙️ Services', subcategories: ['Household Services', 'Health & Wellness', 'Pharmacy & Medical', 'Event Decoration', 'Transportation & Moving', 'Construction Materials'] },
];

export default function PostAdScreen() {
  const isDark = useColorScheme() === 'dark';
  const { isAuthenticated } = useAuth();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.hero}>
          <MaterialCommunityIcons name="post-outline" size={64} color="rgba(255,255,255,0.7)" />
          <Text style={styles.heroTitle}>Post an Ad</Text>
          <Text style={styles.heroSub}>Login to post your free advertisement and reach thousands of buyers</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.heroBtnText}>Login to Post Ad</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.id === selectedCat);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>Post a Free Ad</Text>
        <Text style={styles.headerSub}>Select a category to get started</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, paddingBottom: 30 }}>
        {!selectedCat ? (
          <>
            <Text style={[styles.stepLabel, { color: isDark ? Colors.textDark : Colors.text }]}>
              Step 1: Choose Category
            </Text>
            {CATEGORY_OPTIONS.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.sm]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.85}
              >
                <Text style={[styles.catLabel, { color: isDark ? Colors.textDark : Colors.text }]}>
                  {cat.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.backRow}>
              <TouchableOpacity onPress={() => setSelectedCat(null)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color={Colors.primary} />
                <Text style={styles.backText}>Change Category</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.stepLabel, { color: isDark ? Colors.textDark : Colors.text }]}>
              Step 2: Choose Subcategory
            </Text>
            <Text style={[styles.selectedCatLabel, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              {selectedCategory?.label}
            </Text>
            {selectedCategory?.subcategories.map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[styles.catCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.sm]}
                onPress={() => {
                  Alert.alert(
                    'Post Ad',
                    `You selected: ${sub}\n\nThis will open the ad creation form for "${sub}". Connect this to your backend form endpoints.`,
                    [{ text: 'OK' }]
                  );
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.catLabel, { color: isDark ? Colors.textDark : Colors.text }]}>{sub}</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: isDark ? Colors.cardDark : '#EFF6FF' }]}>
          <Text style={styles.tipsTitle}>💡 Tips for a great ad</Text>
          <Text style={styles.tipItem}>✅ Use clear, high-quality photos</Text>
          <Text style={styles.tipItem}>✅ Write a detailed, honest description</Text>
          <Text style={styles.tipItem}>✅ Set a competitive and fair price</Text>
          <Text style={styles.tipItem}>✅ Include your contact information</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  heroTitle: { color: '#fff', fontSize: 26, fontFamily: 'Poppins_700Bold', marginTop: 16 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', fontFamily: 'Inter_400Regular', marginVertical: 16, lineHeight: 22 },
  heroBtn: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 13, borderRadius: Radius.lg },
  heroBtnText: { color: Colors.primary, fontSize: 16, fontFamily: 'Inter_700Bold' },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  headerTitle: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  stepLabel: { fontSize: Typography.size.lg, fontFamily: 'Poppins_600SemiBold', marginBottom: Spacing.md },
  selectedCatLabel: { fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular', marginBottom: Spacing.md, marginTop: -8 },
  catCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.base, borderRadius: Radius.lg, marginBottom: Spacing.sm,
  },
  catLabel: { fontSize: Typography.size.base, fontFamily: 'Inter_500Medium', flex: 1 },
  backRow: { marginBottom: Spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: Colors.primary, fontSize: Typography.size.base, fontFamily: 'Inter_600SemiBold' },
  tipsCard: { borderRadius: Radius.lg, padding: Spacing.base, marginTop: Spacing.base },
  tipsTitle: { fontSize: Typography.size.base, fontFamily: 'Inter_700Bold', marginBottom: 10, color: Colors.secondary },
  tipItem: { fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginBottom: 4, lineHeight: 20 },
});
