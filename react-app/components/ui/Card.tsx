import React from 'react';
import {
  View, Text, StyleSheet, useColorScheme, ViewStyle, TouchableOpacity,
} from 'react-native';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export function Card({ children, style, onPress, elevated = true }: CardProps) {
  const isDark = useColorScheme() === 'dark';
  const cardStyle = [
    styles.card,
    { backgroundColor: isDark ? Colors.cardDark : Colors.card },
    elevated && Shadow.md,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

interface ListingCardProps {
  title: string;
  price?: string | number;
  location?: string;
  image?: string;
  badge?: string;
  badgeColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ListingCard({ title, price, location, badge, onPress, style }: ListingCardProps) {
  const isDark = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      style={[styles.listingCard, { backgroundColor: isDark ? Colors.cardDark : Colors.card }, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {price != null && (
        <Text style={styles.price}>
          NPR {typeof price === 'number' ? price.toLocaleString() : price}
        </Text>
      )}
      <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={2}>
        {title}
      </Text>
      {location && (
        <Text style={styles.location} numberOfLines={1}>📍 {location}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  listingCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: Typography.size.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  price: {
    color: Colors.primary,
    fontSize: Typography.size.md,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
  },
  location: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.regular,
  },
});
