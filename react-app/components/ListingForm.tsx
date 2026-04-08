import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useColorScheme, ActivityIndicator, Alert, Platform, Image,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, Radius, Shadow, API_BASE_URL } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { listingsApi } from '@/services/api';

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'price';
  required?: boolean;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
}

interface ListingFormProps {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  onSuccess?: (data: any) => void;
}

export function ListingForm({
  title,
  subtitle,
  endpoint,
  fields,
  initialData = {},
  onSuccess,
}: ListingFormProps) {
  const isDark = useColorScheme() === 'dark';
  const { isAuthenticated } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const bg = isDark ? Colors.backgroundDark : Colors.background;
  const cardBg = isDark ? Colors.cardDark : Colors.card;
  const textColor = isDark ? Colors.textDark : Colors.text;
  const textSecondary = isDark ? Colors.textSecondaryDark : Colors.textSecondary;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, images };
      const res = await listingsApi.createListing(endpoint, payload);
      return res.data;
    },
    onSuccess: (data) => {
      Alert.alert('Success', 'Your listing has been created successfully!', [
        { text: 'View Listing', onPress: () => router.push(`/listing/${endpoint}/${data.id}`) },
        { text: 'Post Another', onPress: () => {
          setFormData({});
          setImages([]);
        }},
      ]);
      onSuccess?.(data);
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create listing. Please try again.');
    },
  });

  const pickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('Limit Reached', 'You can only upload up to 10 images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const requiredFields = fields.filter(f => f.required);
    const missing = requiredFields.filter(f => !formData[f.name]);
    
    if (missing.length > 0) {
      Alert.alert('Required Fields', `Please fill in: ${missing.map(f => f.label).join(', ')}`);
      return;
    }
    
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please add at least one image of your item.');
      return;
    }

    mutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={64} color={Colors.textMuted} />
          <Text style={[styles.loginText, { color: textColor }]}>Please login to post an ad</Text>
          <Button title="Login to Continue" onPress={() => router.push('/auth/login')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.headerSub, { color: textSecondary }]}>{subtitle}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Upload */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Photos *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            {images.map((uri, i) => (
              <View key={i} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                  <Ionicons name="close-circle" size={24} color={Colors.error} />
                </TouchableOpacity>
                {i === 0 && <View style={styles.primaryBadge}><Text style={styles.primaryText}>Primary</Text></View>}
              </View>
            ))}
            {images.length < 10 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={28} color={Colors.primary} />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
          <Text style={[styles.imageHint, { color: textSecondary }]}>
            {images.length}/10 photos added. First photo will be the main image.
          </Text>

          {/* Form Fields */}
          {fields.map((field) => (
            <View key={field.name}>
              {field.type === 'select' ? (
                <View style={styles.selectContainer}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {field.label} {field.required && '*'}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectRow}>
                    {field.options?.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.selectChip,
                          { backgroundColor: formData[field.name] === opt.value ? Colors.primary : cardBg },
                          { borderColor: formData[field.name] === opt.value ? Colors.primary : Colors.border },
                        ]}
                        onPress={() => updateField(field.name, opt.value)}
                      >
                        <Text style={[
                          styles.selectChipText,
                          { color: formData[field.name] === opt.value ? '#fff' : textColor },
                        ]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : field.type === 'textarea' ? (
                <Input
                  label={`${field.label}${field.required ? ' *' : ''}`}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChangeText={(v) => updateField(field.name, v)}
                  multiline
                  numberOfLines={4}
                  style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
              ) : (
                <Input
                  label={`${field.label}${field.required ? ' *' : ''}`}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChangeText={(v) => updateField(field.name, v)}
                  keyboardType={field.type === 'number' || field.type === 'price' ? 'numeric' : 'default'}
                />
              )}
            </View>
          ))}

          {/* Submit Button */}
          <Button
            title={mutation.isPending ? 'Creating...' : 'Post Listing'}
            onPress={handleSubmit}
            loading={mutation.isPending}
            fullWidth
            size="lg"
            style={{ marginTop: Spacing.xl, marginBottom: 40 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.base,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  scroll: { padding: Spacing.base, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  loginText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  
  sectionTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', marginBottom: 12, marginTop: 8 },
  imageRow: { gap: 10, paddingVertical: 4 },
  imageWrap: { width: 100, height: 100, borderRadius: Radius.lg, overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', borderRadius: 12 },
  primaryBadge: {
    position: 'absolute', bottom: 4, left: 4, backgroundColor: Colors.primary,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  primaryText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  addImageBtn: {
    width: 100, height: 100, borderRadius: Radius.lg, borderWidth: 2, borderStyle: 'dashed',
    borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  addImageText: { color: Colors.primary, fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 4 },
  imageHint: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 16 },
  
  selectContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 8 },
  selectRow: { gap: 8 },
  selectChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5,
  },
  selectChipText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
});
