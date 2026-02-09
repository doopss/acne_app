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
import { Button, Card, ScoreCircle } from '../components';
import { StoredAnalysis } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows, getScoreLabel, getOverallScoreColor } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { analysisData: StoredAnalysis } }, 'params'>;
};

export function FeedbackScreen({ navigation, route }: Props) {
  const { analysisData } = route.params;
  const { result, photoUri } = analysisData;
  const score = result.scores.overall;
  const scoreLabel = getScoreLabel(score);
  const scoreColor = getOverallScoreColor(score);

  // Generate key insights based on analysis
  const getKeyInsights = () => {
    const insights = [];
    
    // Acne type insight
    insights.push({
      emoji: '🔍',
      text: `${result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} ${result.acne_type} acne detected`,
      color: colors.accentLight,
    });

    // Focus area insight
    const areas = Object.entries(result.distribution);
    if (areas.length > 0) {
      const topArea = areas.sort((a, b) => b[1] - a[1])[0];
      insights.push({
        emoji: '🎯',
        text: `Focus area: ${topArea[0].charAt(0).toUpperCase() + topArea[0].slice(1)}`,
        color: colors.secondaryLight,
      });
    }

    // Lowest score insight
    const scores = [
      { name: 'Hydration', value: result.scores.hydration },
      { name: 'Texture', value: result.scores.texture },
      { name: 'Clarity', value: result.scores.clarity },
    ];
    const lowestScore = scores.sort((a, b) => a.value - b.value)[0];
    if (lowestScore.value < 7) {
      insights.push({
        emoji: '💡',
        text: `${lowestScore.name} could improve`,
        color: colors.primaryLight,
      });
    }

    return insights.slice(0, 3);
  };

  const insights = getKeyInsights();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo thumbnail */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </View>

        {/* Main Score */}
        <View style={styles.scoreSection}>
          <ScoreCircle score={score} size={180} />
          <View style={[styles.scoreLabelBadge, { backgroundColor: scoreColor + '20' }]}>
            <Text style={[styles.scoreLabelText, { color: scoreColor }]}>
              {scoreLabel}
            </Text>
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          {insights.map((insight, index) => (
            <Card key={index} style={[styles.insightCard, { backgroundColor: insight.color }]}>
              <Text style={styles.insightEmoji}>{insight.emoji}</Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </Card>
          ))}
        </View>

        {/* AI Summary */}
        {result.summary && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>🤖</Text>
            <Text style={styles.summaryText}>{result.summary}</Text>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="See Detailed Breakdown"
          onPress={() => navigation.navigate('FeedbackDetailed', { analysisData })}
          variant="outline"
        />
        <Button
          title="View Recommended Products"
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreLabelBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  scoreLabelText: {
    ...typography.h3,
    fontWeight: '600',
  },
  insightsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  insightText: {
    ...typography.body,
    color: colors.charcoal,
    flex: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    marginBottom: spacing.lg,
  },
  summaryEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  summaryText: {
    ...typography.body,
    color: colors.charcoal,
    flex: 1,
    lineHeight: 24,
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
  },
});
