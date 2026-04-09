import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

const SECTIONS = [
  {
    title: '1. Nature of the Platform',
    body: "Jeevika is a digital marketplace platform that allows individuals, professionals, and businesses to publish listings related to products, services, job opportunities, and professional profiles. The platform's purpose is to connect buyers, sellers, service providers, and users so they can communicate and interact directly. Jeevika acts only as an intermediary platform and does not directly sell products, provide services, or participate in transactions between users."
  },
  {
    title: '2. User Registration and Information',
    body: "Users who create listings or profiles must provide accurate, truthful, and up-to-date information, which may include: Name, Phone number, Email address, Location or address, Professional or business details, Product or service information, Profile or product images. Users are solely responsible for the authenticity and accuracy of the information they provide. Providing false, misleading, or fraudulent information may result in account suspension, removal of listings, or permanent banning from the platform."
  },
  {
    title: '3. Consent to Display Information',
    body: "By submitting information to Jeevika, users grant permission to Jeevika Services Pvt. Ltd. to display and publish the submitted information on the platform. This may include: Personal or business name, Contact information, Professional or business profile details, Product or service descriptions, Images or logos. This information is displayed for the purpose of connecting buyers, sellers, and service providers."
  },
  {
    title: '4. Seller and Service Provider Responsibility',
    body: "All sellers, professionals, and service providers listed on the platform are independent individuals or businesses. They are solely responsible for: Authenticity of products or services, Accuracy of listings, Pricing and availability, Communication with buyers, Delivery or completion of services. Jeevika shall not be responsible for disputes, losses, damages, fraud, or misconduct arising from interactions or transactions between users."
  },
  {
    title: '5. Listings and Advertisements',
    body: "Sellers are responsible for the accuracy and legality of the listings they post on Jeevika. Sellers must provide clear and honest information regarding the product or service offered, including images, descriptions, and pricing. Sellers must ensure that their listings comply with all applicable laws and regulations of Nepal. Jeevika reserves the right to review, edit, or remove any listings that violate platform policies, contain misleading information, or are deemed inappropriate or harmful."
  },
  {
    title: '6. Payment and Transactions',
    body: "Jeevika is a platform-only service and does not handle payments. Transactions between buyers and sellers are made directly between the parties. By using the platform, you agree that: Jeevika is not responsible for any disputes, delays, fraud, or issues arising from payments, refunds, deliveries, or transactions between users. All sales and services are subject to the terms agreed upon directly between the buyer and the seller. Users are encouraged to verify product details and seller authenticity before completing any transaction."
  },
  {
    title: '7. Prohibited Activities',
    body: "Users are strictly prohibited from: Posting fraudulent or misleading listings, Uploading illegal products or services, Sharing harmful or malicious content, Attempting to hack or disrupt the platform, Misusing another person's identity or information, Publishing spam, scams, or misleading advertisements. Violation of these rules may result in account termination and possible legal action."
  },
  {
    title: '8. Prohibition of Adult or Illegal Content',
    body: "Users are strictly prohibited from uploading, posting, promoting, or sharing any illegal, harmful, or inappropriate content under the laws of Nepal. This includes but is not limited to: Adult or 18+ content, Pornographic material, Escort or prostitution services, Sexually explicit images or videos, Content involving minors, Content that violates public morality or decency. Jeevika maintains a zero-tolerance policy for such content. Any user found uploading such material will have their account immediately suspended or permanently removed from the platform. Serious violations may be reported to the relevant authorities according to the laws of Nepal."
  },
  {
    title: '9. Compliance with Laws of Nepal',
    body: "All users must comply with the applicable laws and regulations of Nepal while using the platform. This includes but is not limited to compliance with: Electronic Transaction Act 2063, Consumer Protection Act 2018 Nepal. Any illegal activity conducted through the platform may be reported to the appropriate authorities."
  },
  {
    title: '10. Limitation of Liability',
    body: "Jeevika Services Pvt. Ltd. shall not be liable for any direct, indirect, incidental, or consequential damages arising from: User interactions, Transactions between buyers and sellers, Incorrect information provided by users, Fraud or misconduct by third parties. Users access and use the platform at their own risk."
  },
  {
    title: '11. Account Suspension and Content Removal',
    body: "Jeevika reserves the right to: Remove listings or content, Suspend or terminate user accounts, Restrict access to the platform if any user violates these Terms and Conditions or engages in suspicious or harmful activity."
  },
  {
    title: '12. Intellectual Property',
    body: "All platform content including logos, designs, branding, layout, and original materials related to Jeevika are the intellectual property of Jeevika Services Pvt. Ltd. Unauthorized reproduction, copying, or distribution is strictly prohibited."
  },
  {
    title: '13. Changes to Terms',
    body: "Jeevika may update or modify these Terms and Conditions at any time without prior notice. Continued use of the platform after updates constitutes acceptance of the revised terms."
  },
  {
    title: '14. Governing Law and Jurisdiction',
    body: "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of Nepal. Any disputes arising from the use of the platform shall fall under the jurisdiction of the courts of Nepal."
  }
];

export default function TermsScreen() {
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
           <Text style={styles.heroTitle}>Terms and Conditions</Text>
           <Text style={styles.heroSubtitle}>Jeevika Services Pvt. Ltd.</Text>
           <Text style={styles.heroDate}>Effective Date: 2026</Text>
        </LinearGradient>

        {/* Intro */}
        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
          <Text style={[styles.body, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
            Welcome to the website and platform operated by Jeevika Services Pvt. Ltd. ("Jeevika", "we", "our", or "the platform"). By accessing, browsing, registering, or using this platform, you agree to comply with and be legally bound by the following Terms and Conditions.
          </Text>
        </View>

        {/* Quick Nav Chips */}
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text, marginLeft: 8, marginTop: 8, marginBottom: 12 }]}>
          Quick Navigation
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickNav}>
          {SECTIONS.map((sec, idx) => (
            <View key={idx} style={[styles.navPill, { backgroundColor: isDark ? Colors.cardDark : '#fff' }]}>
              <Text style={[styles.navPillText, { color: isDark ? Colors.textDark : Colors.textSecondary }]}>{sec.title}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Terms Sections */}
        <View style={{ marginTop: 24 }}>
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

        {/* Contact Info Footer */}
        <View style={[styles.contactCard, { backgroundColor: isDark ? Colors.surfaceDark : '#E8F5E9' }]}>
          <Text style={[styles.contactHeader, { color: isDark ? Colors.textDark : Colors.primaryDark }]}>Contact Information</Text>
          
          <Text style={[styles.contactLabel, { color: isDark ? Colors.textDark : Colors.text }]}>Company Details:</Text>
          <Text style={[styles.contactValue, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Company: Jeevika Services Pvt. Ltd.{'\n'}Founder & CEO: Rajaul Khan{'\n'}General Manager: Salman Khan{'\n'}Address: Nepal</Text>
          
          <Text style={[styles.contactLabel, { color: isDark ? Colors.textDark : Colors.text, marginTop: 12 }]}>Get in Touch:</Text>
          <Text style={[styles.contactValue, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Email: support@jeevika.services{'\n'}Website: www.jeevika.live</Text>
          
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
  heroDate: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Inter_400Regular' },

  card: { padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: 16, ...Shadow.sm },
  body: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 24 },

  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  quickNav: { gap: 10, paddingBottom: 10, paddingHorizontal: 4 },
  navPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.full, ...Shadow.sm, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navPillText: { fontSize: 13, fontFamily: 'Inter_500Medium' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  numberBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold' },

  contactCard: { padding: Spacing.xl, borderRadius: Radius.xl, marginTop: 12, ...Shadow.sm },
  contactHeader: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', marginBottom: 16, textAlign: 'center' },
  contactLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  contactValue: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 16 },
});
