import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Card, Button, ScoreBar } from '../components';
import { colors, spacing, typography, borderRadius, shadows, getOverallScoreColor } from '../styles/theme';
import { Analysis } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ProgressScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComparison, setSelectedComparison] = useState<{
    baseline: Analysis;
    followup: Analysis;
  } | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, [user]);

  const fetchAnalyses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);

      // Auto-select comparison if we have at least 2 analyses
      if (data && data.length >= 2) {
        setSelectedComparison({
          baseline: data[data.length - 1],
          followup: data[0],
        });
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateImprovement = (baseline: Analysis, followup: Analysis) => {
    if (!baseline.overall_score) return 0;
    return ((followup.overall_score || 0) - baseline.overall_score) / baseline.overall_score * 100;
  };

  const getScoreChange = (baseline: number | null, followup: number | null) => {
    if (!baseline || !followup) return 0;
    return followup - baseline;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTrendIndicator = (change: number) => {
    if (change > 0.5) return { icon: '📈', color: colors.scoreGood, text: `+${change.toFixed(1)}` };
    if (change < -0.5) return { icon: '📉', color: colors.scoreVeryPoor, text: change.toFixed(1) };
    return { icon: '➡️', color: colors.gray, text: 'No change' };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>📊</Text>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (analyses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>No Analyses Yet</Text>
          <Text style={styles.emptyDescription}>
            Take your first skin scan to start tracking your progress over time
          </Text>
          <Button
            title="Start First Scan"
            onPress={() => navigation.navigate('Camera')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (analyses.length === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📈</Text>
          <Text style={styles.emptyTitle}>One More Scan Needed</Text>
          <Text style={styles.emptyDescription}>
            Take another scan in a few weeks to track your progress and see improvement
          </Text>
          <Button
            title="Take Another Scan"
            onPress={() => navigation.navigate('Camera')}
          />
          <TouchableOpacity 
            style={styles.viewAnalysisButton}
            onPress={() => navigation.navigate('Results', { analysisId: analyses[0].id })}
          >
            <Text style={styles.viewAnalysisText}>View Latest Analysis →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const improvement = selectedComparison 
    ? calculateImprovement(selectedComparison.baseline, selectedComparison.followup)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>{analyses.length} scans total</Text>
        </View>

        {/* Overall Improvement */}
        {selectedComparison && (
          <Card style={styles.improvementCard} variant="elevated">
            <View style={styles.improvementHeader}>
              <Text style={styles.improvementTitle}>Overall Improvement</Text>
              <Text style={styles.improvementPeriod}>
                {formatFullDate(selectedComparison.baseline.created_at)} → {formatFullDate(selectedComparison.followup.created_at)}
              </Text>
            </View>
            
            <View style={styles.improvementContent}>
              <Text 
                style={[
                  styles.improvementValue,
                  { color: improvement >= 0 ? colors.scoreGood : colors.scoreVeryPoor }
                ]}
              >
                {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
              </Text>
              <Text style={styles.improvementEmoji}>
                {improvement >= 10 ? '🎉' : improvement >= 0 ? '✨' : '💪'}
              </Text>
            </View>
            
            <Text style={styles.improvementMessage}>
              {improvement >= 10 
                ? "Amazing progress! Your skin is improving significantly."
                : improvement >= 0 
                ? "You're on the right track! Keep up the good work."
                : "Don't worry, results take time. Stay consistent with your routine."}
            </Text>
          </Card>
        )}

        {/* Before/After Comparison */}
        {selectedComparison && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Before & After</Text>
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonItem}>
                <Image 
                  source={{ uri: selectedComparison.baseline.photo_url }} 
                  style={styles.comparisonImage} 
                />
                <View style={styles.comparisonInfo}>
                  <Text style={styles.comparisonLabel}>Before</Text>
                  <Text style={styles.comparisonDate}>
                    {formatDate(selectedComparison.baseline.created_at)}
                  </Text>
                  <Text 
                    style={[
                      styles.comparisonScore,
                      { color: getOverallScoreColor(selectedComparison.baseline.overall_score || 0) }
                    ]}
                  >
                    {Math.round(selectedComparison.baseline.overall_score || 0)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.comparisonArrow}>→</Text>
              
              <View style={styles.comparisonItem}>
                <Image 
                  source={{ uri: selectedComparison.followup.photo_url }} 
                  style={styles.comparisonImage} 
                />
                <View style={styles.comparisonInfo}>
                  <Text style={styles.comparisonLabel}>After</Text>
                  <Text style={styles.comparisonDate}>
                    {formatDate(selectedComparison.followup.created_at)}
                  </Text>
                  <Text 
                    style={[
                      styles.comparisonScore,
                      { color: getOverallScoreColor(selectedComparison.followup.overall_score || 0) }
                    ]}
                  >
                    {Math.round(selectedComparison.followup.overall_score || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Score Changes */}
        {selectedComparison && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Score Changes</Text>
            <Card>
              {[
                { label: 'Hydration', baseline: selectedComparison.baseline.hydration_score, followup: selectedComparison.followup.hydration_score },
                { label: 'Texture', baseline: selectedComparison.baseline.texture_score, followup: selectedComparison.followup.texture_score },
                { label: 'Inflammation', baseline: selectedComparison.baseline.inflammation_score, followup: selectedComparison.followup.inflammation_score },
                { label: 'Clarity', baseline: selectedComparison.baseline.clarity_score, followup: selectedComparison.followup.clarity_score },
                { label: 'Pores', baseline: selectedComparison.baseline.pore_score, followup: selectedComparison.followup.pore_score },
                { label: 'Dark Spots', baseline: selectedComparison.baseline.dark_spots_score, followup: selectedComparison.followup.dark_spots_score },
              ].map((item) => {
                const change = getScoreChange(item.baseline, item.followup);
                const trend = renderTrendIndicator(change);
                return (
                  <View key={item.label} style={styles.scoreChangeItem}>
                    <View style={styles.scoreChangeHeader}>
                      <Text style={styles.scoreChangeLabel}>{item.label}</Text>
                      <View style={styles.scoreChangeTrend}>
                        <Text style={styles.scoreChangeIcon}>{trend.icon}</Text>
                        <Text style={[styles.scoreChangeValue, { color: trend.color }]}>
                          {trend.text}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.scoreChangeBar}>
                      <View style={styles.scoreChangeBarBase}>
                        <View 
                          style={[
                            styles.scoreChangeBarFill,
                            { 
                              width: `${(item.baseline || 0) * 10}%`,
                              backgroundColor: colors.gray + '60'
                            }
                          ]}
                        />
                      </View>
                      <View style={styles.scoreChangeBarBase}>
                        <View 
                          style={[
                            styles.scoreChangeBarFill,
                            { 
                              width: `${(item.followup || 0) * 10}%`,
                              backgroundColor: trend.color
                            }
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scan History</Text>
          <Card>
            {analyses.map((analysis, index) => (
              <TouchableOpacity
                key={analysis.id}
                style={[
                  styles.timelineItem,
                  index < analyses.length - 1 && styles.timelineItemBorder
                ]}
                onPress={() => navigation.navigate('Results', { analysisId: analysis.id })}
              >
                <Image source={{ uri: analysis.photo_url }} style={styles.timelineImage} />
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineDate}>{formatFullDate(analysis.created_at)}</Text>
                  <View style={styles.timelineBadges}>
                    <Text style={[styles.timelineBadge, { color: getOverallScoreColor(analysis.overall_score || 0) }]}>
                      Score: {Math.round(analysis.overall_score || 0)}
                    </Text>
                    <Text style={styles.timelineSeverity}>{analysis.severity}</Text>
                  </View>
                </View>
                <Text style={styles.timelineArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* New Scan CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="📸 Take New Scan"
            onPress={() => navigation.navigate('Camera')}
          />
          <Text style={styles.ctaHint}>
            Track your progress by scanning every 2-4 weeks
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  viewAnalysisButton: {
    marginTop: spacing.md,
    padding: spacing.md,
  },
  viewAnalysisText: {
    ...typography.body,
    color: colors.primary,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
  },
  improvementCard: {
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  improvementHeader: {
    marginBottom: spacing.md,
  },
  improvementTitle: {
    ...typography.h3,
    color: colors.charcoal,
  },
  improvementPeriod: {
    ...typography.caption,
    color: colors.gray,
  },
  improvementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  improvementValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  improvementEmoji: {
    fontSize: 48,
  },
  improvementMessage: {
    ...typography.body,
    color: colors.charcoal,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonImage: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - 60) / 2,
    height: (SCREEN_WIDTH - spacing.lg * 2 - 60) / 2,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  comparisonInfo: {
    alignItems: 'center',
  },
  comparisonLabel: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  comparisonDate: {
    ...typography.caption,
    color: colors.gray,
  },
  comparisonScore: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  comparisonArrow: {
    fontSize: 24,
    color: colors.primary,
    marginHorizontal: spacing.sm,
  },
  scoreChangeItem: {
    marginBottom: spacing.md,
  },
  scoreChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scoreChangeLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.charcoal,
  },
  scoreChangeTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreChangeIcon: {
    fontSize: 14,
  },
  scoreChangeValue: {
    ...typography.caption,
    fontWeight: '600',
  },
  scoreChangeBar: {
    gap: 2,
  },
  scoreChangeBarBase: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  scoreChangeBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  timelineItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  timelineImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineDate: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.charcoal,
  },
  timelineBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  timelineBadge: {
    ...typography.caption,
    fontWeight: '600',
  },
  timelineSeverity: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'capitalize',
  },
  timelineArrow: {
    ...typography.body,
    color: colors.gray,
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaHint: {
    ...typography.caption,
    color: colors.gray,
    marginTop: spacing.sm,
  },
});
