import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth ? styles.fullWidth : undefined,
    isDisabled ? styles.disabled : undefined,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const labelStyle: TextStyle[] = [
    styles.label,
    styles[`labelSize_${size}`],
    styles[`labelVariant_${variant}`],
    textStyle as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#fff'}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          <Text style={labelStyle}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.md,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Sizes
  size_sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: Radius.sm },
  size_md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  size_lg: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.base, borderRadius: Radius.lg },

  // Variants
  variant_primary: { backgroundColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.secondary },
  variant_outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  variant_ghost: { backgroundColor: 'transparent' },
  variant_danger: { backgroundColor: Colors.error },

  // Label base
  label: { fontFamily: Typography.fontFamily.semiBold },
  labelSize_sm: { fontSize: Typography.size.sm },
  labelSize_md: { fontSize: Typography.size.base },
  labelSize_lg: { fontSize: Typography.size.md },

  // Label color per variant
  labelVariant_primary: { color: '#fff' },
  labelVariant_secondary: { color: '#fff' },
  labelVariant_outline: { color: Colors.primary },
  labelVariant_ghost: { color: Colors.primary },
  labelVariant_danger: { color: '#fff' },
});
