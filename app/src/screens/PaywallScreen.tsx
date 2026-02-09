import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { storage } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function PaywallScreen({ navigation }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    // MVP: Just set purchased to true
    // TODO: Integrate RevenueCat for real purchases
    try {
      await storage.setHasPurchased(true);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    const hasPurchased = await storage.hasPurchased();
    if (hasPurchased) {
      navigation.replace('Home');
    } else {
      Alert.alert('No Purchase Found', 'We couldn\'t find a previous purchase to restore.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PREMIUM</Text>
          </View>
          <Text style={styles.title}>Unlock Your{'\n'}Clear Skin Journey</Text>
          <Text style={styles.subtitle}>
            Get unlimited scans and personalized recommendations
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.featureEmoji}>📸</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Unlimited Scans</Text>
              <Text style={styles.featureDescription}>
                Analyze your skin as often as you want
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.accentLight }]}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Detailed Reports</Text>
              <Text style={styles.featureDescription}>
                In-depth analysis of every skin metric
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.featureEmoji}>✨</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Products</Text>
              <Text style={styles.featureDescription}>
                Personalized recommendations that work
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plans}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>SAVE 34%</Text>
            </View>
            <Text style={styles.planName}>Yearly</Text>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$79</Text>
              <Text style={styles.planPeriod}>/year</Text>
            </View>
            <Text style={styles.planSavings}>$6.58/month</Text>
            {selectedPlan === 'yearly' && (
              <View style={styles.planCheck}>
                <Text style={styles.planCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text style={styles.planName}>Monthly</Text>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
            <Text style={styles.planSavings}>Cancel anytime</Text>
            {selectedPlan === 'monthly' && (
              <View style={styles.planCheck}>
                <Text style={styles.planCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Trial Info */}
        <View style={styles.trialInfo}>
          <Text style={styles.trialEmoji}>🎁</Text>
          <View style={styles.trialTextContainer}>
            <Text style={styles.trialTitle}>7-Day Free Trial</Text>
            <Text style={styles.trialSubtitle}>
              You won't be charged until the trial ends
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          title="Start Free Trial"
          onPress={handlePurchase}
          loading={loading}
          size="large"
        />
        
        <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
  },
  features: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  plans: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    position: 'relative',
    ...shadows.sm,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  planBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  planBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  planName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: spacing.xs,
  },
  planPrice: {
    ...typography.h2,
    color: colors.charcoal,
  },
  planPeriod: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  planSavings: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  planCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCheckText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  trialEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  trialTextContainer: {
    flex: 1,
  },
  trialTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  trialSubtitle: {
    ...typography.bodySmall,
    color: colors.darkGray,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
  },
  restoreButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  restoreText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  terms: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
  },
});
