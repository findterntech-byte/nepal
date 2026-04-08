import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api';

const CATEGORY_ICONS: Record<string, string> = {
  'real-estate': 'business-outline',
  'vehicles': 'car-outline',
  'education': 'school-outline',
  'electronics': 'laptop-outline',
  'fashion': 'shirt-outline',
  'furniture': 'bed-outline',
  'skilled-labour': 'construct-outline',
  'health-wellness': 'fitness-outline',
  'default': 'cube-outline',
};

function getIconForCategory(slug: string, name: string): string {
  const normalized = (slug || name || '').toLowerCase().replace(/[\s&]/g, '-');
  return CATEGORY_ICONS[normalized] || CATEGORY_ICONS[normalized.split('-')[0]] || CATEGORY_ICONS['default'];
}

const ALL_STEPS = [
  { id: 'account_type', title: 'Account Type', subtitle: 'How will you use Jeevika?' },
  { id: 'basic_info', title: 'Basic Information', subtitle: 'Set your login details' },
  { id: 'category', title: 'Category Selection', subtitle: 'What do you want to sell?' },
  { id: 'details', title: 'Extra Details', subtitle: 'Address and Documents' },
];

export default function SignupScreen() {
  const isDark = useColorScheme() === 'dark';
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'buyer' | 'seller' | 'pro_profile' | ''>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isProTypeOpen, setIsProTypeOpen] = useState(false);
  
  const { data: apiCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['admin-categories-signup'],
    queryFn: async () => {
      try {
        const res = await categoriesApi.getAll();
        return res.data || [];
      } catch { return []; }
    },
  });
  
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    categories: [] as string[],
    proProfileType: '',
    country: 'Nepal', state: '', city: '', area: '', address: '', postalCode: '', additionalInfo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: any) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const toggleCategory = (cat: string) => {
    const isSelected = form.categories.includes(cat);
    if (isSelected) {
      update('categories', form.categories.filter(c => c !== cat));
    } else {
      update('categories', [...form.categories, cat]);
    }
  };

  const getStepsToRender = () => {
    if (accountType === 'buyer') return [ALL_STEPS[0], ALL_STEPS[1]];
    if (accountType === 'pro_profile') return [ALL_STEPS[0], ALL_STEPS[1], ALL_STEPS[3]];
    return ALL_STEPS; // seller gets all
  };
  
  const stepsToRender = getStepsToRender();
  const currentStepObj = stepsToRender[step];

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (currentStepObj.id === 'account_type' && !accountType) e.accountType = 'Please select account type';
    if (currentStepObj.id === 'basic_info') {
      if (!form.firstName.trim()) e.firstName = 'First name is required';
      if (!form.lastName.trim()) e.lastName = 'Last name is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      if (!form.email.trim()) e.email = 'Email is required';
      if (!form.password) e.password = 'Password is required';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (currentStepObj.id === 'category') {
      if (form.categories.length === 0) e.categories = 'Please select at least one category';
    }
    if (currentStepObj.id === 'details') {
      if (accountType === 'pro_profile' && !form.proProfileType) e.proProfileType = 'Please select a profile type';
      if (!form.state) e.state = 'State is required';
      if (!form.city) e.city = 'City is required';
      if (!form.address) e.address = 'Address is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < stepsToRender.length - 1) { setStep(s => s + 1); return; }
    
    setLoading(true);
    try {
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`,
        username: form.email.split('@')[0],
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: accountType,
        proProfileType: accountType === 'pro_profile' ? form.proProfileType : undefined,
      };
      await register(payload);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelection = () => {
    const categoriesList = apiCategories.map((c: any) => ({
      id: c.id,
      name: c.name,
      sub: `${(c.subcategories || []).length} subcategories`,
      icon: getIconForCategory(c.slug, c.name),
      subcategories: (c.subcategories || []).filter((s:any)=>s.isActive !== false).map((s:any) => ({
        id: s.id,
        name: s.name
      }))
    }));

    if (activeCategory) {
      const parent = categoriesList.find((c: any) => c.id === activeCategory);
      return (
        <View style={{ gap: 12 }}>
          <TouchableOpacity onPress={() => setActiveCategory(null)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={{ color: Colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 14, marginLeft: 4 }}>Back to Categories</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 4 }}>{parent?.name}</Text>
          
          {parent?.subcategories.map((sub: any) => {
            const isSelected = form.categories.includes(sub.id);
            return (
              <TouchableOpacity
                key={sub.id}
                onPress={() => toggleCategory(sub.id)}
                style={{
                  flexDirection: 'row', alignItems: 'center', padding: 16,
                  backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: Radius.lg,
                  borderWidth: 1.5, borderColor: isSelected ? Colors.primary : 'transparent'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_500Medium', color: isSelected ? Colors.text : Colors.textSecondary }}>{sub.name}</Text>
                </View>
                <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: isSelected ? Colors.primary : Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? Colors.primary : 'transparent' }}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      );
    }

    return (
      <View style={styles.gridContainer}>
        {catsLoading && <Text style={{ color: Colors.textSecondary }}>Loading categories...</Text>}
        {categoriesList.map((c: any) => {
          // Check if any subcategory of this category is selected
          const hasSelectedSub = c.subcategories.some((sub: any) => form.categories.includes(sub.id));
          return (
            <TouchableOpacity 
              key={c.id} 
              onPress={() => setActiveCategory(c.id)}
              style={[
                styles.catCard, 
                { backgroundColor: isDark ? Colors.backgroundDark : Colors.background },
                hasSelectedSub && styles.catCardActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.catIconWrap, hasSelectedSub && { backgroundColor: Colors.primary }]}>
                <Ionicons name={c.icon as any} size={20} color={hasSelectedSub ? '#fff' : Colors.primary} />
              </View>
              <Text style={[styles.catName, { color: isDark ? Colors.textDark : Colors.text }]}>{c.name}</Text>
              <Text style={styles.catSub}>{c.sub}</Text>
            </TouchableOpacity>
          );
        })}
        {errors.categories && <Text style={[styles.errorText, { marginLeft: 8 }]}>{errors.categories}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={['#108DE9', Colors.primary]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.hero}>
            <TouchableOpacity style={styles.backBtn} onPress={() => step === 0 ? router.back() : setStep(s => s - 1)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Sign Up</Text>
            <Text style={styles.heroSub}>{currentStepObj.title}</Text>
            
            {/* Progress Circles */}
            <View style={styles.progressRow}>
              {stepsToRender.map((_, i) => {
                const isActive = step === i;
                const isPast = step > i;
                return (
                  <View key={i} style={[
                    styles.progressCircle, 
                    isActive && styles.progressCircleActive,
                    isPast && { backgroundColor: 'transparent', borderColor: '#fff', borderWidth: 2 }
                  ]}>
                    {isPast ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <Text style={[styles.progressNumber, isActive && { color: Colors.primary }]}>{i + 1}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </LinearGradient>

          <View style={[styles.formCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
            {currentStepObj.id === 'account_type' && (
              <View style={{ gap: 16 }}>
                <Text style={[styles.stepTitle, { color: isDark ? Colors.textDark : Colors.text }]}>Select Account Type</Text>
                
                {[
                  { id: 'pro_profile', label: 'Pro-Profile', sub: 'Create a professional profile with dynamic fields', icon: 'briefcase-outline' },
                  { id: 'buyer', label: 'Buyer', sub: 'Looking to buy or rent property', icon: 'person-outline' },
                  { id: 'seller', label: 'Seller', sub: 'List and sell properties/items', icon: 'storefront-outline' }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.accountRow,
                      { backgroundColor: isDark ? Colors.backgroundDark : Colors.background },
                      accountType === type.id && styles.accountRowActive
                    ]}
                    onPress={() => setAccountType(type.id as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.accIconBox}>
                      <Ionicons name={type.icon as any} size={24} color={accountType === type.id ? Colors.primary : Colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accLabel, { color: isDark ? Colors.textDark : Colors.text }]}>{type.label}</Text>
                      <Text style={styles.accSub}>{type.sub}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {errors.accountType && <Text style={styles.errorText}>{errors.accountType}</Text>}
              </View>
            )}

            {currentStepObj.id === 'basic_info' && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Input containerStyle={{ flex: 1 }} label="First Name *" placeholder="Enter first name" value={form.firstName} onChangeText={v => update('firstName', v)} error={errors.firstName} />
                  <Input containerStyle={{ flex: 1 }} label="Last Name *" placeholder="Enter last name" value={form.lastName} onChangeText={v => update('lastName', v)} error={errors.lastName} />
                </View>
                <Input label="Email Address *" placeholder="your.email@example.com" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
                <Input label="Phone Number *" placeholder="+977-9800000000" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" error={errors.phone} />
                <Input label="Password *" placeholder="Enter your password" value={form.password} onChangeText={v => update('password', v)} secureTextEntry error={errors.password} />
                <Input label="Confirm Password *" placeholder="Confirm your password" value={form.confirmPassword} onChangeText={v => update('confirmPassword', v)} secureTextEntry error={errors.confirmPassword} />
              </View>
            )}

            {currentStepObj.id === 'category' && (
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.stepTitle, { color: isDark ? Colors.textDark : Colors.text, marginBottom: 0 }]}>Select Categories *</Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>{form.categories.length} selected</Text>
                </View>
                <Input placeholder="Search categories..." leftIcon={<Ionicons name="search" size={18} color={Colors.textMuted} />} />
                {renderCategorySelection()}
              </View>
            )}

            {currentStepObj.id === 'details' && (
              <View style={{ gap: 12 }}>
                {accountType === 'pro_profile' && (
                  <View style={{ zIndex: 10 }}>
                    <Text style={[styles.inputLabel, { marginTop: 0 }]}>Pro-Profile Type *</Text>
                    <TouchableOpacity 
                      onPress={() => setIsProTypeOpen(!isProTypeOpen)} 
                      style={[styles.dropdownBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
                      activeOpacity={0.8}
                    >
                      <Text style={{ color: form.proProfileType ? (isDark ? Colors.textDark : Colors.text) : Colors.textMuted, fontSize: 14 }}>
                        {form.proProfileType || 'Select profile type'}
                      </Text>
                      <Ionicons name={isProTypeOpen ? "chevron-up" : "chevron-down"} size={20} color={Colors.textMuted} />
                    </TouchableOpacity>
                    
                    {isProTypeOpen && (
                      <ScrollView nestedScrollEnabled style={[styles.dropdownList, { backgroundColor: isDark ? Colors.cardDark : '#fff' }]}>
                        {['Job Seeker', 'Business', 'Freelancer', 'Matrimony', 'Influencer', 'Company', 'Student', 'Doctor', 'Teacher/Tutor', 'General User', 'Artist', 'NGO'].map((type) => (
                          <TouchableOpacity 
                            key={type} 
                            style={[styles.dropdownItem, form.proProfileType === type && { backgroundColor: Colors.primary }]}
                            onPress={() => { update('proProfileType', type); setIsProTypeOpen(false); }}
                          >
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: form.proProfileType === type ? '#fff' : (isDark ? Colors.textDark : Colors.text) }}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                    {errors.proProfileType && <Text style={styles.errorText}>{errors.proProfileType}</Text>}
                  </View>
                )}

                <View style={{ flexDirection: 'row', gap: 12, marginTop: accountType === 'pro_profile' ? 8 : 0 }}>
                  <Input containerStyle={{ flex: 1 }} label="Country *" value={form.country} editable={false} />
                  <Input containerStyle={{ flex: 1 }} label="State *" placeholder="Province" value={form.state} onChangeText={v => update('state', v)} error={errors.state} />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Input containerStyle={{ flex: 1 }} label="City *" placeholder="City" value={form.city} onChangeText={v => update('city', v)} error={errors.city} />
                  <Input containerStyle={{ flex: 1 }} label="Area" placeholder="Area" value={form.area} onChangeText={v => update('area', v)} />
                </View>
                <Input label="Address *" placeholder="Full Address" value={form.address} onChangeText={v => update('address', v)} error={errors.address} />
                <Input label="Postal Code" placeholder="Postal Code" value={form.postalCode} onChangeText={v => update('postalCode', v)} />

                <Text style={styles.inputLabel}>Upload Documents</Text>
                <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
                  <Ionicons name="cloud-upload-outline" size={32} color={Colors.textMuted} />
                  <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
                  <Text style={styles.uploadSub}>PDF, JPG, PNG (Max 5MB)</Text>
                </TouchableOpacity>

                <Input label="Additional Information" placeholder="Enter any additional information here..." multiline numberOfLines={4} value={form.additionalInfo} onChangeText={v => update('additionalInfo', v)} style={{ height: 100, textAlignVertical: 'top' }} />
              </View>
            )}

            <Button
              title={step < stepsToRender.length - 1 ? 'Next →' : 'Sign Up'}
              onPress={handleNext}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 60, alignItems: 'center' },
  backBtn: { position: 'absolute', top: Spacing.md, left: Spacing.base, padding: 4, zIndex: 10 },
  heroTitle: { color: '#fff', fontSize: 28, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontFamily: 'Inter_400Regular' },
  progressRow: { flexDirection: 'row', gap: 24, marginTop: 24, justifyContent: 'center' },
  progressCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  progressCircleActive: { backgroundColor: '#fff' },
  progressNumber: { color: '#fff', fontSize: 16, fontFamily: 'Poppins_600SemiBold' },

  formCard: {
    flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, padding: Spacing.xl, ...Shadow.md, paddingBottom: 40
  },
  stepTitle: { fontSize: 20, fontFamily: 'Poppins_600SemiBold', marginBottom: 4 },

  accountRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border },
  accountRowActive: { borderColor: Colors.primary },
  accIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  accLabel: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  accSub: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catCard: { width: '48%', padding: Spacing.sm, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'flex-start' },
  catCardActive: { borderColor: Colors.primary },
  catIconWrap: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.05)', marginBottom: 8 },
  catName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  catSub: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },

  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: 16, height: 50 },
  dropdownList: { marginTop: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, maxHeight: 240, ...Shadow.md },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },

  inputLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginTop: 8, marginBottom: 8 },
  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.textMuted, borderRadius: Radius.lg, padding: 24, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' },
  uploadText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, marginTop: 12 },
  uploadSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4 },

  errorText: { color: Colors.error, fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
