import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const isDark = useColorScheme() === 'dark';
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { icon: 'list-outline', label: 'My Listings', screen: '/seller-dashboard' },
    { icon: 'heart-outline', label: 'Saved / Wishlist', screen: '/(tabs)/wishlist' },
    { icon: 'person-outline', label: 'Edit Profile', screen: '/profile' },
    { icon: 'settings-outline', label: 'Settings', screen: '/settings' },
    { icon: 'headset-outline', label: 'Contact Us', screen: '/(tabs)/contact' },
    { icon: 'information-circle-outline', label: 'About Us', screen: '/(tabs)/about' },
    { icon: 'document-text-outline', label: 'Terms & Conditions', screen: '/(tabs)/terms' },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy', screen: '/(tabs)/privacy' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
        edges={['top']}
      >
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.guestHero}>
          <MaterialCommunityIcons name="account-circle" size={80} color="rgba(255,255,255,0.6)" />
          <Text style={styles.guestTitle}>Join Jeevika</Text>
          <Text style={styles.guestSub}>Post ads, save listings, manage your account</Text>
          <TouchableOpacity style={styles.guestLoginBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.guestLoginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestRegBtn} onPress={() => router.push('/auth/signup')}>
            <Text style={styles.guestRegText}>Create Account</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {menuItems.slice(4).map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}
              onPress={() => router.push(item.screen as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: isDark ? Colors.textDark : Colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}
      edges={['top']}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Header */}
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.profileHero}>
          <View style={styles.avatarRow}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>
                  {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => router.push('/profile')}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.fullName || user?.username}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.phone && <Text style={styles.userPhone}>📞 {user.phone}</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Post Ad CTA */}
        <TouchableOpacity
          style={[styles.postAdCTA, Shadow.md]}
          onPress={() => router.push('/(tabs)/post-ad')}
          activeOpacity={0.85}
        >
          <View style={styles.postAdIcon}>
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.postAdTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
              Post a Free Ad
            </Text>
            <Text style={styles.postAdSub}>Reach thousands of buyers today</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}
              onPress={() => router.push(item.screen as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: isDark ? Colors.textDark : Colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Jeevika v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  guestHero: {
    alignItems: 'center', paddingTop: 40, paddingBottom: 40, paddingHorizontal: 32,
  },
  guestTitle: { color: '#fff', fontSize: 22, fontFamily: 'Poppins_700Bold', marginTop: 16 },
  guestSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  guestLoginBtn: {
    width: '100%', backgroundColor: '#fff', paddingVertical: 13, borderRadius: Radius.lg, alignItems: 'center', marginBottom: 10,
  },
  guestLoginText: { color: Colors.primary, fontSize: 16, fontFamily: 'Inter_700Bold' },
  guestRegBtn: {
    width: '100%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', paddingVertical: 13, borderRadius: Radius.lg, alignItems: 'center',
  },
  guestRegText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold' },

  profileHero: { alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 24 },
  avatarRow: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#fff', fontSize: 36, fontFamily: 'Poppins_700Bold' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center',
  },
  userName: { color: '#fff', fontSize: 20, fontFamily: 'Poppins_700Bold' },
  userEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  userPhone: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  statPill: { flex: 1, alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 20, fontFamily: 'Poppins_700Bold' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },

  postAdCTA: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: Spacing.base, marginTop: Spacing.base,
    backgroundColor: 'rgba(232,64,64,0.05)', borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: Radius.lg, padding: Spacing.md, borderStyle: 'dashed',
  },
  postAdIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(232,64,64,0.1)', alignItems: 'center', justifyContent: 'center' },
  postAdTitle: { fontSize: Typography.size.md, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  postAdSub: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular' },

  menuSection: { marginTop: Spacing.base, gap: 1 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    marginHorizontal: Spacing.base, borderRadius: Radius.lg, marginBottom: 6,
  },
  menuLabel: { flex: 1, fontSize: Typography.size.base, fontFamily: 'Inter_400Regular' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: Spacing.base, marginTop: Spacing.lg,
    paddingVertical: 14, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.error,
  },
  logoutText: { color: Colors.error, fontSize: Typography.size.base, fontFamily: 'Inter_600SemiBold' },
  version: { color: Colors.textMuted, fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 16 },
});
