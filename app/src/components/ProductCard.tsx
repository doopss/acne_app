import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { Product, Recommendation } from '../types';

interface ProductCardProps {
  product: Product;
  recommendation?: Recommendation;
  onPress?: () => void;
  compact?: boolean;
}

export function ProductCard({ product, recommendation, onPress, compact = false }: ProductCardProps) {
  const handleBuyPress = async () => {
    const url = product.amazon_url || product.sephora_url || product.ulta_url || product.yesstyle_url;
    if (url) {
      await Linking.openURL(url);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price varies';
    return `$${price.toFixed(2)}`;
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress || handleBuyPress}>
        <View style={styles.compactImageContainer}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.compactImage} />
          ) : (
            <View style={[styles.compactImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>🧴</Text>
            </View>
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactBrand}>{product.brand}</Text>
          <Text style={styles.compactName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.compactPrice}>{formatPrice(product.price_usd)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      {recommendation?.rank && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{recommendation.rank}</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderEmoji}>🧴</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price_usd)}</Text>
          
          {product.effectiveness_rating && (
            <View style={styles.rating}>
              <Text style={styles.ratingText}>
                {'⭐'.repeat(Math.round(product.effectiveness_rating))}
              </Text>
              <Text style={styles.ratingValue}>{product.effectiveness_rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      {recommendation?.reasoning && (
        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningLabel}>Why this product:</Text>
          <Text style={styles.reasoning}>{recommendation.reasoning}</Text>
        </View>
      )}

      {recommendation?.usage_instructions && (
        <View style={styles.usageContainer}>
          <Text style={styles.usageLabel}>How to use:</Text>
          <Text style={styles.usage}>{recommendation.usage_instructions}</Text>
        </View>
      )}

      {product.key_ingredients && product.key_ingredients.length > 0 && (
        <View style={styles.ingredients}>
          {product.key_ingredients.slice(0, 4).map((ingredient, index) => (
            <View key={index} style={styles.ingredientTag}>
              <Text style={styles.ingredientText}>
                {ingredient.replace(/_/g, ' ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.buyButton} onPress={handleBuyPress}>
        <Text style={styles.buyButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rankText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  imageContainer: {
    marginRight: spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  placeholderImage: {
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  headerInfo: {
    flex: 1,
  },
  brand: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 2,
  },
  price: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  ratingValue: {
    ...typography.caption,
    color: colors.gray,
    marginLeft: 4,
  },
  reasoningContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  reasoningLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  reasoning: {
    ...typography.bodySmall,
    color: colors.charcoal,
  },
  usageContainer: {
    marginBottom: spacing.sm,
  },
  usageLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: 2,
  },
  usage: {
    ...typography.bodySmall,
    color: colors.darkGray,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  ingredientTag: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  ingredientText: {
    ...typography.caption,
    color: colors.accentDark,
    textTransform: 'capitalize',
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buyButtonText: {
    ...typography.button,
    color: colors.white,
  },
  // Compact styles
  compactCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    width: 140,
    ...shadows.sm,
  },
  compactImageContainer: {
    marginBottom: spacing.sm,
  },
  compactImage: {
    width: '100%',
    height: 100,
    borderRadius: borderRadius.sm,
  },
  compactInfo: {},
  compactBrand: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  compactName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 2,
  },
  compactPrice: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
});
