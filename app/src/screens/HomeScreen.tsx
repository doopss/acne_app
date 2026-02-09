import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Card, ScoreCircle } from '../components';
import { storage, StoredAnalysis } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows, getScoreLabel } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function HomeScreen({ navigation }: Props) {
  const [lastAnalysis, setLastAnalysis] = useState<StoredAnalysis | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const analysis = await storage.getLastAnalysis();
      setLastAnalysis(analysis);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>✦</Text>
            </View>
            <Text style={styles.appName}>ClearSkin</Text>
          </View>
        </View>

        {/* Main CTA Card */}
        <Card style={styles.ctaCard} variant="elevated">
          <View style={styles.ctaContent}>
            <View style={styles.ctaIconContainer}>
              <Text style={styles.ctaIcon}>📸</Text>
            </View>
            <Text style={styles.ctaTitle}>Ready to analyze?</Text>
            <Text style={styles.ctaDescription}>
              Take a quick selfie and get instant AI-powered insights about your skin
            </Text>
            <Button
              title="Scan Your Skin"
              onPress={() => navigation.navigate('Camera')}
              size="large"
              style={styles.ctaButton}
            />
          </View>
        </Card>

        {/* Last Analysis */}
        {lastAnalysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Last Analysis</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Feedback', { 
                analysisData: lastAnalysis 
              })}
            >
              <Card style={styles.analysisCard}>
                <View style={styles.analysisContent}>
                  <ScoreCircle 
                    score={lastAnalysis.result.scores.overall} 
                    size={80} 
                  />
                  <View style={styles.analysisInfo}>
                    <Text style={styles.analysisLabel}>
                      {getScoreLabel(lastAnalysis.result.scores.overall)}
                    </Text>
                    <Text style={styles.analysisDate}>
                      {formatDate(lastAnalysis.createdAt)}
                    </Text>
                    <View style={styles.analysisBadges}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {lastAnalysis.result.acne_type}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.analysisArrow}>→</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepsRow}>
            <View style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.stepEmoji}>📸</Text>
              </View>
              <Text style={styles.stepLabel}>Scan</Text>
            </View>
            <Text style={styles.stepArrow}>→</Text>
            <View style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: colors.accentLight }]}>
                <Text style={styles.stepEmoji}>🔬</Text>
              </View>
              <Text style={styles.stepLabel}>Analyze</Text>
            </View>
            <Text style={styles.stepArrow}>→</Text>
            <View style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: colors.secondaryLight }]}>
                <Text style={styles.stepEmoji}>✨</Text>
              </View>
              <Text style={styles.stepLabel}>Improve</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 18,
    color: colors.white,
  },
  appName: {
    ...typography.h2,
    color: colors.charcoal,
    letterSpacing: -0.5,
  },
  // CTA Card
  ctaCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.cardBackground,
  },
  ctaContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  ctaIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  ctaIcon: {
    fontSize: 40,
  },
  ctaTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  ctaDescription: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaButton: {
    width: '100%',
  },
  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  // Analysis Card
  analysisCard: {
    padding: spacing.md,
  },
  analysisContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  analysisLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  analysisDate: {
    ...typography.bodySmall,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  analysisBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  analysisArrow: {
    ...typography.h2,
    color: colors.gray,
  },
  // Steps
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepEmoji: {
    fontSize: 28,
  },
  stepLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.charcoal,
  },
  stepArrow: {
    ...typography.h3,
    color: colors.lightGray,
    marginHorizontal: spacing.md,
  },
});
