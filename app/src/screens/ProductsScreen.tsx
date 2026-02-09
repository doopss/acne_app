import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button, Card } from '../components';
import { StoredAnalysis } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { analysisData: StoredAnalysis } }, 'params'>;
};

// Sample product recommendations
const PRODUCTS = [
  {
    id: '1',
    name: 'CeraVe Foaming Facial Cleanser',
    brand: 'CeraVe',
    price: 15.99,
    emoji: '🧴',
    reason: 'Gentle cleanser that removes excess oil without stripping skin',
    concerns: ['oily_skin', 'persistent_breakouts'],
    url: 'https://www.amazon.com/dp/B01N1LL62W',
  },
  {
    id: '2',
    name: 'Paula\'s Choice 2% BHA Exfoliant',
    brand: 'Paula\'s Choice',
    price: 32.00,
    emoji: '💧',
    reason: 'Salicylic acid unclogs pores and smooths skin texture',
    concerns: ['blackheads', 'texture', 'persistent_breakouts'],
    url: 'https://www.amazon.com/dp/B00949CTQQ',
  },
  {
    id: '3',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    price: 5.90,
    emoji: '✨',
    reason: 'Reduces sebum production and minimizes pore appearance',
    concerns: ['oily_skin', 'texture', 'persistent_breakouts'],
    url: 'https://www.amazon.com/dp/B06VSL3V4T',
  },
  {
    id: '4',
    name: 'La Roche-Posay Effaclar Duo',
    brand: 'La Roche-Posay',
    price: 29.99,
    emoji: '🔬',
    reason: 'Targets breakouts while moisturizing without clogging pores',
    concerns: ['persistent_breakouts', 'scarring'],
    url: 'https://www.amazon.com/dp/B004QXNLTW',
  },
  {
    id: '5',
    name: 'EltaMD UV Clear SPF 46',
    brand: 'EltaMD',
    price: 39.00,
    emoji: '☀️',
    reason: 'Lightweight sunscreen with niacinamide for acne-prone skin',
    concerns: ['scarring', 'hormonal', 'persistent_breakouts'],
    url: 'https://www.amazon.com/dp/B002MSN3QQ',
  },
];

export function ProductsScreen({ navigation, route }: Props) {
  const { analysisData } = route.params;

  const handleProductPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  // Calculate total routine cost
  const totalCost = PRODUCTS.slice(0, 5).reduce((sum, p) => sum + p.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Recommended For You</Text>
          <Text style={styles.subtitle}>
            Based on your analysis and skin concerns
          </Text>
        </View>

        {/* Products List */}
        <View style={styles.productsList}>
          {PRODUCTS.map((product, index) => (
            <Card key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productRank}>
                  <Text style={styles.productRankText}>{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
              </View>
              
              <View style={styles.productReason}>
                <Text style={styles.reasonIcon}>💡</Text>
                <Text style={styles.reasonText}>{product.reason}</Text>
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => handleProductPress(product.url)}
                >
                  <Text style={styles.shopButtonText}>Shop Now →</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        {/* Total Cost */}
        <Card style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Complete Routine</Text>
            <Text style={styles.totalPrice}>${totalCost.toFixed(2)}</Text>
          </View>
          <Text style={styles.totalNote}>
            Products selected to work together for your skin type
          </Text>
        </Card>

        {/* Affiliate Disclosure */}
        <Text style={styles.disclosure}>
          * We may earn a commission from purchases made through these links at no extra cost to you
        </Text>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="📸 New Analysis"
          onPress={() => navigation.navigate('Camera')}
          variant="outline"
        />
        <Button
          title="🏠 Back to Home"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.darkGray,
  },
  productsList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  productCard: {
    padding: spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productRankText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '700',
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  productEmoji: {
    fontSize: 32,
  },
  productReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  reasonIcon: {
    fontSize: 14,
  },
  reasonText: {
    ...typography.bodySmall,
    color: colors.charcoal,
    flex: 1,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    ...typography.h3,
    color: colors.charcoal,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  shopButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  totalCard: {
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  totalLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  totalPrice: {
    ...typography.h2,
    color: colors.charcoal,
  },
  totalNote: {
    ...typography.caption,
    color: colors.darkGray,
  },
  disclosure: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
  },
});
