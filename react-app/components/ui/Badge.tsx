import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], styles[`size_${size}`], style]}>
      <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  size_sm: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  size_md: { paddingHorizontal: Spacing.md, paddingVertical: 4 },

  badge_default: { backgroundColor: '#F1F5F9' },
  badge_primary: { backgroundColor: Colors.primary },
  badge_accent: { backgroundColor: Colors.accent },
  badge_success: { backgroundColor: Colors.success },
  badge_warning: { backgroundColor: '#FEF9C3' },
  badge_error: { backgroundColor: Colors.error },

  label: { fontFamily: Typography.fontFamily.semiBold },
  labelSize_sm: { fontSize: Typography.size.xs },
  labelSize_md: { fontSize: Typography.size.sm },

  label_default: { color: Colors.textSecondary },
  label_primary: { color: '#fff' },
  label_accent: { color: '#fff' },
  label_success: { color: '#fff' },
  label_warning: { color: '#92400E' },
  label_error: { color: '#fff' },
});
