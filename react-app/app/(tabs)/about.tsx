import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

export default function AboutScreen() {
  const isDark = useColorScheme() === 'dark';

  const values = [
    { label: 'Integrity', icon: 'shield-check' },
    { label: 'Customer Trust', icon: 'handshake' },
    { label: 'Innovation', icon: 'lightbulb-on' },
    { label: 'Community Empowerment', icon: 'account-group' }
  ];

  const leaders = [
    { name: 'Mr. Rajaul Khan', role: 'CEO & Founder' },
    { name: 'Mr. Salman Khan', role: 'General Manager' },
    { name: 'Mr. Prem Panday', role: 'Manager' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? Colors.surfaceDark : Colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDark ? Colors.textDark : Colors.text} />
        </TouchableOpacity>
        <Image source={require('@/assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.heroCard}>
           <Text style={styles.heroTitle}>Welcome to Jeevika</Text>
           <Text style={styles.heroText}>Connecting Nepal with trusted services and digital marketplaces.</Text>
        </LinearGradient>

        {/* Overview Box */}
        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(15,77,42,0.1)' }]}>
              <Ionicons name="business" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Our Overview</Text>
          </View>
          <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            Jeevika is a comprehensive online platform designed to connect Nepal with trusted services and marketplaces. Our vision is to bring buyers, sellers, and service providers together under one trusted digital roof, making transactions simple, transparent, and accessible across the country.
            {'\n\n'}
            We aim to simplify the buying and selling process while creating opportunities for businesses, professionals, and skilled workers to reach a wider audience.
          </Text>
        </View>

        {/* Two Column Cards: Mission & Vision */}
        <View style={styles.rowGrid}>
          <View style={[styles.gridCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(15,77,42,0.1)', alignSelf: 'flex-start' }]}>
              <Ionicons name="rocket" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Our Mission</Text>
            <Text style={[styles.bodySmall, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              To connect Nepal with trusted services and digital marketplaces, empowering people through technology-driven solutions.
            </Text>
          </View>
          
          <View style={[styles.gridCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(15,77,42,0.1)', alignSelf: 'flex-start' }]}>
              <Ionicons name="eye" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Our Vision</Text>
            <Text style={[styles.bodySmall, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
              To become Nepal's most trusted digital services ecosystem, ensuring nationwide digital inclusion and accessibility.
            </Text>
          </View>
        </View>

        {/* Story */}
        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Our Story</Text>
          <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            Jeevika Services Pvt. Ltd. was born from a simple yet powerful idea—to connect Nepal with trusted services through one digital platform. In a country rich with talent, businesses, and skilled professionals, access to the right opportunities and reliable services was often scattered and limited.
          </Text>
        </View>

        {/* Values */}
        <View>
          <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text, marginLeft: Spacing.xs, marginBottom: 12 }]}>Core Values</Text>
          <View style={styles.valuesGrid}>
            {values.map((v, i) => (
              <View key={i} style={[styles.valuePill, { backgroundColor: isDark ? Colors.cardDark : '#fff' }]}>
                <MaterialCommunityIcons name={v.icon as any} size={20} color={Colors.primary} />
                <Text style={[styles.valueText, { color: isDark ? Colors.textDark : Colors.text }]}>{v.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Leadership */}
        <View style={{ marginTop: 24 }}>
          <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text, marginLeft: Spacing.xs, marginBottom: 12 }]}>Leadership Team</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {leaders.map((leader, i) => (
              <View key={i} style={[styles.leaderCard, { backgroundColor: isDark ? Colors.cardDark : '#fff' }]}>
                <View style={styles.leaderAvatar}>
                  <Text style={styles.leaderInitials}>{leader.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</Text>
                </View>
                <Text style={[styles.leaderName, { color: isDark ? Colors.textDark : Colors.text }]}>{leader.name}</Text>
                <Text style={styles.leaderRole}>{leader.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Contact Us */}
        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card, marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text, marginBottom: 16 }]}>Get in Touch</Text>
          
          <TouchableOpacity 
            style={[styles.contactRow, { backgroundColor: isDark ? Colors.backgroundDark : '#F8F9FA' }]} 
            onPress={() => Linking.openURL('tel:+9779705132820')}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}><Ionicons name="call" size={20} color={Colors.primary} /></View>
            <Text style={[styles.contactText, { color: isDark ? Colors.textDark : Colors.text }]}>+977 9705132820</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactRow, { backgroundColor: isDark ? Colors.backgroundDark : '#F8F9FA' }]} 
            onPress={() => Linking.openURL('mailto:jeevikaservices56@gmail.com')}
            activeOpacity={0.7}
          >
            <View style={styles.contactIcon}><Ionicons name="mail" size={20} color={Colors.primary} /></View>
            <Text style={[styles.contactText, { color: isDark ? Colors.textDark : Colors.text }]}>jeevikaservices56@gmail.com</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm 
  },
  backBtn: { padding: 4 },
  headerLogo: { width: 100, height: 40 },
  content: { padding: Spacing.base },
  
  heroCard: {
    padding: Spacing.xl, borderRadius: Radius.xl, marginBottom: 20,
    ...Shadow.md
  },
  heroTitle: { color: '#fff', fontSize: 28, fontFamily: 'Poppins_700Bold', marginBottom: 8 },
  heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },

  card: { padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: 16, ...Shadow.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrapper: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  
  title: { fontSize: 20, fontFamily: 'Poppins_600SemiBold', marginTop: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  
  body: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  bodySmall: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  
  rowGrid: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  gridCard: { flex: 1, padding: Spacing.lg, borderRadius: Radius.xl, ...Shadow.sm },

  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valuePill: { 
    flexDirection: 'row', alignItems: 'center', gap: 10, 
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.full, ...Shadow.sm 
  },
  valueText: { fontSize: 14, fontFamily: 'Inter_500Medium' },

  leaderCard: { 
    width: 140, padding: 16, borderRadius: Radius.xl, alignItems: 'center', 
    marginVertical: 4, marginLeft: 2, ...Shadow.sm 
  },
  leaderAvatar: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(15,77,42,0.1)', 
    alignItems: 'center', justifyContent: 'center', marginBottom: 12 
  },
  leaderInitials: { color: Colors.primary, fontSize: 20, fontFamily: 'Poppins_700Bold' },
  leaderName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: 4 },
  leaderRole: { color: Colors.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },

  contactRow: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, 
    padding: 16, borderRadius: Radius.lg, marginBottom: 10 
  },
  contactIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(15,77,42,0.1)', alignItems: 'center', justifyContent: 'center' },
  contactText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
