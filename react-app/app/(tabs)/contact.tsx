import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContactScreen() {
  const isDark = useColorScheme() === 'dark';
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      Alert.alert('Success', 'Your message has been sent. We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1200);
  };

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
        {/* Banner */}
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.heroCard}>
           <Text style={styles.heroTitle}>Contact Us</Text>
           <Text style={styles.heroSubtitle}>We're here to help you</Text>
        </LinearGradient>

        <View style={styles.grid}>
          {/* Information Card */}
          <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="map-marker-outline" size={24} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Head Office</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={[styles.boldText, { color: isDark ? Colors.textDark : Colors.text }]}>Jeevika Services Pvt. Ltd.</Text>
              <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Janakpur, Nepal</Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
              <View>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>+977 9705132820</Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>+977 9709142561</Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>+977 9810274988</Text>
              </View>
            </View>

            <View style={[styles.contactRow, { marginTop: 12 }]}>
              <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
              <View>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>jeevika7076@gmail.com</Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>support@jeevika.services</Text>
              </View>
            </View>

            <View style={[styles.contactRow, { marginTop: 12 }]}>
              <Ionicons name="time-outline" size={20} color={Colors.textMuted} />
              <View>
                <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>Mon - Fri: 6:20 PM onwards</Text>
                <Text style={[styles.mutedText, { color: Colors.textMuted }]}>Available for queries and support</Text>
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text, marginBottom: 8 }]}>Send us a Message</Text>
            <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary, marginBottom: 20 }]}>
              तपाईंको कुनै प्रश्न वा सुझाव छ? हामीलाई सन्देश पठाउनुहोस्।
            </Text>

            <View style={styles.formRow}>
              <Input label="Full Name *" placeholder="Enter your full name" value={form.name} onChangeText={(t) => setForm(p => ({ ...p, name: t }))} />
              <Input label="Email Address *" placeholder="Enter your email address" keyboardType="email-address" value={form.email} onChangeText={(t) => setForm(p => ({ ...p, email: t }))} />
              <Input label="Phone Number" placeholder="+977-XXXXXXXXXX" keyboardType="phone-pad" value={form.phone} onChangeText={(t) => setForm(p => ({ ...p, phone: t }))} />
              <Input label="Subject *" placeholder="Enter message subject" value={form.subject} onChangeText={(t) => setForm(p => ({ ...p, subject: t }))} />
              <Input label="Message *" placeholder="Enter your message here..." multiline numberOfLines={4} value={form.message} onChangeText={(t) => setForm(p => ({ ...p, message: t }))} style={{ height: 100, textAlignVertical: 'top' }} />

              <Button title="Send Message" onPress={handleSubmit} loading={loading} style={{ marginTop: 8 }} />
            </View>
          </View>

          {/* Connect With Us */}
          <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            <Text style={[styles.cardTitle, { color: isDark ? Colors.textDark : Colors.text, marginBottom: 16 }]}>Connect With Us</Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.boldText, { color: isDark ? Colors.textDark : Colors.text }]}>Collaborations</Text>
              <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary, marginTop: 4 }]}>
                किसिमका सहयोग, साझेदारी वा व्यावसायिक प्रस्तावको लागि सम्पर्क गर्नुहोस्।
              </Text>
            </View>

            <View>
              <Text style={[styles.boldText, { color: isDark ? Colors.textDark : Colors.text }]}>Customer Service</Text>
              <Text style={[styles.infoText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary, marginTop: 4 }]}>
                कुनै पनि समस्या वा प्रश्नको लागि हाम्रो ग्राहक सेवा टिम सधैं तत्पर छ।
              </Text>
            </View>
          </View>
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

  heroCard: { padding: Spacing.xl, borderRadius: Radius.xl, marginBottom: 16, ...Shadow.md },
  heroTitle: { color: '#fff', fontSize: 26, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontFamily: 'Inter_400Regular' },

  grid: { gap: 16 },
  card: { padding: Spacing.lg, borderRadius: Radius.xl, ...Shadow.sm },
  cardTitle: { fontSize: 20, fontFamily: 'Poppins_600SemiBold' },

  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  infoBlock: { marginBottom: 20, paddingLeft: 34 },
  boldText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  infoText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  mutedText: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  
  formRow: { gap: Spacing.md },
});
