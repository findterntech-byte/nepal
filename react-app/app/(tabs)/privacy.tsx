import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: "When users register, submit listings, or interact with the platform, we may collect the following information: \n• Full name\n• Phone number\n• Email address\n• Location or address\n• Professional or business details\n• Product or service information\n• Profile photographs or product images\n• Any other information voluntarily submitted by the user\n\nThis information may be displayed on the platform for the purpose of connecting buyers, sellers, and service providers."
  },
  {
    title: '2. Purpose of Information Collection',
    body: "The information collected by Jeevika is used for the following purposes:\n• To create and manage user profiles or listings\n• To enable communication between buyers and sellers\n• To improve the functionality and user experience of the platform\n• To ensure platform security and prevent fraudulent activity\n• To provide customer support and respond to inquiries"
  },
  {
    title: '3. Public Display of Information',
    body: "Since Jeevika is a marketplace platform, some user information submitted voluntarily may be publicly visible on the platform. This information is displayed to allow users to connect directly with each other:\n• Name and Contact number\n• Professional and Business details\n• Product or service descriptions\n• Images provided by the user"
  },
  {
    title: '4. Data Protection and Security',
    body: "Jeevika takes reasonable technical and administrative measures to protect user data from unauthorized access, misuse, or disclosure. However, no internet-based platform can guarantee absolute security. Users are encouraged to protect their account information and avoid sharing sensitive data publicly."
  },
  {
    title: '5. User Responsibility',
    body: "Users are responsible for ensuring that the information they provide is accurate and lawful. Jeevika is not responsible for incorrect or misleading information submitted by users. Users should also exercise caution when sharing personal information publicly on the platform."
  },
  {
    title: '6. Third-Party Links',
    body: "The platform may contain links to third-party websites or external services. Jeevika does not control or take responsibility for the privacy practices of those external websites. Users are encouraged to review the privacy policies of third-party services before sharing their information."
  },
  {
    title: '7. Data Retention',
    body: "Jeevika may retain user information for as long as necessary to operate the platform, maintain listings, and comply with legal obligations. Users may request removal or modification of their information by contacting the platform."
  },
  {
    title: '8. Compliance with Laws of Nepal',
    body: "Jeevika operates in accordance with applicable laws and regulations of Nepal. User information will only be used in a lawful and transparent manner.\n\n• Electronic Transaction Act 2063\n• Consumer Protection Act 2018 Nepal"
  },
  {
    title: '9. Changes to the Privacy Policy',
    body: "Jeevika reserves the right to update or modify this Privacy Policy at any time. Updated policies will be published on this page. Continued use of the platform indicates acceptance of the updated policy."
  }
];

export default function PrivacyScreen() {
  const isDark = useColorScheme() === 'dark';

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
        {/* Title Banner */}
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.heroCard}>
           <Text style={styles.heroTitle}>Privacy Policy</Text>
           <Text style={styles.heroSubtitle}>Jeevika Services Pvt. Ltd.</Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
          <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            Jeevika respects the privacy of all users and is committed to protecting the personal information shared on our website. This Privacy Policy explains how we collect, use, store, and protect user information when using the Jeevika platform.
          </Text>
        </View>

        {/* Sections */}
        <View style={{ marginTop: 8 }}>
          {SECTIONS.map((sec, idx) => (
            <View key={idx} style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.numberBadge, { backgroundColor: 'rgba(15,77,42,0.1)' }]}>
                  <Text style={[styles.numberText, { color: Colors.primary }]}>{idx + 1}</Text>
                </View>
                <Text style={[{ color: isDark ? Colors.textDark : Colors.text }, { flex: 1, fontSize: 16, fontFamily: 'Poppins_600SemiBold' }]}>
                  {sec.title.split('. ')[1]}
                </Text>
              </View>
              <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
                {sec.body}
              </Text>
            </View>
          ))}
        </View>

        {/* Pillars of Privacy */}
        <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
          <View style={styles.pillar}>
            <MaterialCommunityIcons name="shield-check" size={32} color={Colors.primary} />
            <Text style={[styles.pillarText, { color: isDark ? Colors.textDark : Colors.text }]}>Secure Platform</Text>
          </View>
          <View style={styles.pillar}>
            <MaterialCommunityIcons name="gavel" size={32} color={Colors.primary} />
            <Text style={[styles.pillarText, { color: isDark ? Colors.textDark : Colors.text }]}>Compliant</Text>
          </View>
          <View style={styles.pillar}>
            <MaterialCommunityIcons name="eye-outline" size={32} color={Colors.primary} />
            <Text style={[styles.pillarText, { color: isDark ? Colors.textDark : Colors.text }]}>Transparent</Text>
          </View>
        </View>

        {/* Contact Info Footer */}
        <View style={[styles.contactCard, { backgroundColor: isDark ? Colors.surfaceDark : '#E8F5E9' }]}>
          <Text style={[styles.contactHeader, { color: isDark ? Colors.textDark : Colors.primaryDark }]}>Privacy Inquiries</Text>
          
          <Text style={[styles.contactLabel, { color: isDark ? Colors.textDark : Colors.text }]}>Company Details:</Text>
          <Text style={[styles.contactValue, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Company: Jeevika Services Pvt. Ltd.{'\n'}Founder & CEO: Rajaul Khan{'\n'}General Manager: Salman Khan{'\n'}Address: Nepal</Text>
          
          <Text style={[styles.contactLabel, { color: isDark ? Colors.textDark : Colors.text, marginTop: 12 }]}>Contact Privacy Support:</Text>
          <Text style={[styles.contactValue, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Email: support@jeevika.services</Text>
          
          <View style={styles.divider} />
          
          <Text style={{ fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginTop: 12, color: isDark ? Colors.textDark : Colors.text }}>
            Approved by:{'\n'}Founder & CEO – Rajaul Khan
          </Text>
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

  heroCard: { padding: Spacing.xl, borderRadius: Radius.xl, marginBottom: 20, ...Shadow.md },
  heroTitle: { color: '#fff', fontSize: 26, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: 12 },

  card: { padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: 16, ...Shadow.sm },
  body: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 24 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  numberBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold' },

  pillar: { alignItems: 'center', width: '30%' },
  pillarText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 8, textAlign: 'center' },

  contactCard: { padding: Spacing.xl, borderRadius: Radius.xl, marginTop: 24, ...Shadow.sm },
  contactHeader: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: 16, textAlign: 'center' },
  contactLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  contactValue: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 16 },
});
