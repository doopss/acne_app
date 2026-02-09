import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button, Card, ScoreBar } from '../components';
import { StoredAnalysis } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { analysisData: StoredAnalysis } }, 'params'>;
};

export function FeedbackDetailedScreen({ navigation, route }: Props) {
  const { analysisData } = route.params;
  const { result, photoUri, createdAt } = analysisData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDistributionEmoji = (area: string) => {
    switch (area.toLowerCase()) {
      case 'forehead': return '👆';
      case 'cheeks': return '😊';
      case 'chin': return '👇';
      case 'jaw': return '🦷';
      case 'nose': return '👃';
      default: return '📍';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with photo */}
        <View style={styles.header}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Detailed Analysis</Text>
            <Text style={styles.headerDate}>{formatDate(createdAt)}</Text>
          </View>
        </View>

        {/* Score Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          <Card>
            <ScoreBar label="Hydration" score={result.scores.hydration} />
            <ScoreBar label="Texture" score={result.scores.texture} />
            <ScoreBar label="Inflammation" score={result.scores.inflammation} />
            <ScoreBar label="Clarity" score={result.scores.clarity} />
            <ScoreBar label="Pores" score={result.scores.pores} />
            <ScoreBar label="Dark Spots" score={result.scores.dark_spots} />
          </Card>
        </View>

        {/* Affected Areas */}
        {Object.keys(result.distribution).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Affected Areas</Text>
            <Card>
              <View style={styles.distributionGrid}>
                {Object.entries(result.distribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([area, percentage]) => (
                    <View key={area} style={styles.distributionItem}>
                      <Text style={styles.distributionEmoji}>
                        {getDistributionEmoji(area)}
                      </Text>
                      <Text style={styles.distributionArea}>
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </Text>
                      <View style={styles.distributionBarContainer}>
                        <View 
                          style={[
                            styles.distributionBar, 
                            { width: `${percentage}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.distributionPercent}>{percentage}%</Text>
                    </View>
                  ))}
              </View>
            </Card>
          </View>
        )}

        {/* Analysis Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Card style={styles.diagnosisCard}>
            <View style={styles.diagnosisRow}>
              <View style={styles.diagnosisItem}>
                <Text style={styles.diagnosisLabel}>Type</Text>
                <View style={styles.diagnosisBadge}>
                  <Text style={styles.diagnosisBadgeText}>
                    {result.acne_type}
                  </Text>
                </View>
              </View>
              <View style={styles.diagnosisItem}>
                <Text style={styles.diagnosisLabel}>Severity</Text>
                <View style={[styles.diagnosisBadge, styles.severityBadge]}>
                  <Text style={styles.diagnosisBadgeText}>
                    {result.severity}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.confidenceRow}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <Text style={styles.confidenceValue}>
                {Math.round(result.confidence * 100)}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Tips */}
        {result.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Card>
              {result.recommendations.map((rec, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{rec}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="View Products"
          onPress={() => navigation.navigate('Products', { analysisData })}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.charcoal,
  },
  headerDate: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  // Distribution
  distributionGrid: {
    gap: spacing.sm,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  distributionEmoji: {
    fontSize: 20,
    width: 28,
  },
  distributionArea: {
    ...typography.bodySmall,
    color: colors.charcoal,
    width: 70,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  distributionPercent: {
    ...typography.caption,
    color: colors.gray,
    width: 36,
    textAlign: 'right',
  },
  // Diagnosis
  diagnosisCard: {
    padding: spacing.md,
  },
  diagnosisRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  diagnosisItem: {
    flex: 1,
  },
  diagnosisLabel: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  diagnosisBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  severityBadge: {
    backgroundColor: colors.secondaryLight,
  },
  diagnosisBadgeText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
    textTransform: 'capitalize',
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  confidenceLabel: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  confidenceValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  // Tips
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumberText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    ...typography.body,
    color: colors.charcoal,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
  },
});
