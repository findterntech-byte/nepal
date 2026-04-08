import React from 'react';
import { View, TextInput, Text, StyleSheet, useColorScheme, ViewStyle, TextInputProps } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: isDark ? Colors.textDark : Colors.text }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? Colors.surfaceDark : Colors.surface,
            borderColor: error ? Colors.error : isDark ? Colors.borderDark : Colors.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? Colors.textDark : Colors.text,
              paddingLeft: leftIcon ? 0 : Spacing.base,
              paddingRight: rightIcon ? 0 : Spacing.base,
            },
            style,
          ]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.base },
  label: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    minHeight: 50,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    paddingVertical: Spacing.md,
  },
  iconLeft: {
    paddingHorizontal: Spacing.md,
  },
  iconRight: {
    paddingHorizontal: Spacing.md,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.xs,
  },
});
