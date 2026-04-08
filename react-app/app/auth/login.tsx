import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const isDark = useColorScheme() === 'dark';
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username or email is required';
    if (!password) e.password = 'Password is required';
    if (password && password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(username.trim(), password);
      // Determine redirection based on role
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.accountType === 'seller') {
          router.replace('/seller-dashboard');
          return;
        }
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* Hero */}
          <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.hero}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>NC</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Welcome Back!</Text>
            <Text style={styles.heroSub}>Sign in to your Nepal Classifieds account</Text>
          </LinearGradient>

          {/* Form */}
          <View style={[styles.formCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, Shadow.lg]}>
            <Input
              label="Username or Email"
              placeholder="Enter your username or email"
              value={username}
              onChangeText={setUsername}
              error={errors.username}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPass}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              }
            />
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.base }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.registerRow}>
              <Text style={[styles.registerText, { color: isDark ? Colors.textSecondaryDark : Colors.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.registerLink}> Sign up free</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink} onPress={() => router.push('/terms')}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink} onPress={() => router.push('/privacy')}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 60, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', padding: 4, marginBottom: 16 },
  logoContainer: { marginBottom: 16 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  logoText: { color: '#fff', fontSize: 24, fontFamily: 'Poppins_700Bold' },
  heroTitle: { color: '#fff', fontSize: 26, fontFamily: 'Poppins_700Bold', marginBottom: 6 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  formCard: {
    borderRadius: 24, marginHorizontal: Spacing.base,
    marginTop: -30, padding: Spacing.xl, ...Shadow.lg,
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 4, marginTop: -8 },
  forgotText: { color: Colors.primary, fontSize: Typography.size.sm, fontFamily: 'Inter_600SemiBold' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.base, gap: 10 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontSize: Typography.size.sm, fontFamily: 'Inter_400Regular' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: Typography.size.base, fontFamily: 'Inter_400Regular' },
  registerLink: { color: Colors.primary, fontSize: Typography.size.base, fontFamily: 'Inter_700Bold' },
  terms: { color: Colors.textSecondary, fontSize: 11, textAlign: 'center', padding: 20, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  termsLink: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
});
