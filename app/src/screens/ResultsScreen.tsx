import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Card, ScoreCircle, ScoreBar, ProductCard, Button } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Analysis, Recommendation, Product } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { analysisId: string; scrollTo?: string } }, 'params'>;
};

export function ResultsScreen({ navigation, route }: Props) {
  const { analysisId, scrollTo } = route.params;
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [recommendations, setRecommendations] = useState<(Recommendation & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const recommendationsRef = useRef<View>(null);

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      // Fetch analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (analysisError) throw analysisError;
      setAnalysis(analysisData);

      // Fetch recommendations with products
      const { data: recsData, error: recsError } = await supabase
        .from('recommendations')
        .select(`
          *,
          product:products(*)
        `)
        .eq('analysis_id', analysisId)
        .order('rank', { ascending: true });

      if (recsData) {
        setRecommendations(recsData as any);
      }

    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!analysis) return;
    
    try {
      await Share.share({
        message: `My skin score is ${Math.round(analysis.overall_score || 0)}/100! 🌟 Analyzed with Clear Skin app.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'mild': return colors.scoreGood;
      case 'moderate': return colors.scoreFair;
      case 'severe': return colors.scoreVeryPoor;
      default: return colors.gray;
    }
  };

  const getDistributionEmoji = (area: string) => {
    switch (area) {
      case 'forehead': return '👆';
      case 'cheeks': return '😊';
      case 'chin': return '👇';
      case 'jaw': return '🦷';
      case 'nose': return '👃';
      default: return '📍';
    }
  };

  if (loading || !analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>✨</Text>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Header with Photo */}
        <View style={styles.header}>
          <Image source={{ uri: analysis.photo_url }} style={styles.photo} />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerDate}>{formatDate(analysis.created_at)}</Text>
          </View>
        </View>

        {/* Overall Score */}
        <Card style={styles.scoreCard} variant="elevated">
          <View style={styles.scoreContent}>
            <ScoreCircle score={analysis.overall_score || 0} size={180} />
            <View style={styles.scoreInfo}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: getSeverityColor(analysis.severity) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getSeverityColor(analysis.severity) }]}>
                    {analysis.severity || 'Unknown'} severity
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.badgeText, { color: colors.primaryDark }]}>
                    {analysis.acne_type || 'Mixed'} acne
                  </Text>
                </View>
              </View>
              <Text style={styles.confidenceText}>
                AI Confidence: {Math.round((analysis.ai_confidence || 0.8) * 100)}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Detailed Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          <Card>
            <ScoreBar label="Hydration" score={analysis.hydration_score || 5} />
            <ScoreBar label="Texture" score={analysis.texture_score || 5} />
            <ScoreBar label="Inflammation" score={analysis.inflammation_score || 5} />
            <ScoreBar label="Clarity" score={analysis.clarity_score || 5} />
            <ScoreBar label="Pores" score={analysis.pore_score || 5} />
            <ScoreBar label="Dark Spots" score={analysis.dark_spots_score || 5} />
          </Card>
        </View>

        {/* Distribution Map */}
        {analysis.distribution && Object.keys(analysis.distribution).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Affected Areas</Text>
            <Card>
              <View style={styles.distributionGrid}>
                {Object.entries(analysis.distribution).map(([area, percentage]) => (
                  <View key={area} style={styles.distributionItem}>
                    <Text style={styles.distributionEmoji}>{getDistributionEmoji(area)}</Text>
                    <Text style={styles.distributionArea}>{area}</Text>
                    <View style={styles.distributionBarContainer}>
                      <View 
                        style={[
                          styles.distributionBar, 
                          { width: `${percentage}%`, backgroundColor: colors.primary }
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

        {/* AI Summary */}
        {analysis.ai_response?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>🤖</Text>
              <Text style={styles.summaryText}>{analysis.ai_response.summary}</Text>
            </Card>
          </View>
        )}

        {/* AI Recommendations */}
        {analysis.ai_response?.recommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips For You</Text>
            <Card>
              {analysis.ai_response.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipNumber}>{index + 1}</Text>
                  <Text style={styles.tipText}>{rec}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Product Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section} ref={recommendationsRef}>
            <Text style={styles.sectionTitle}>Recommended Products</Text>
            {recommendations.map((rec) => (
              <ProductCard
                key={rec.id}
                product={rec.product}
                recommendation={rec}
              />
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="📤 Share Results"
            onPress={handleShare}
            variant="outline"
          />
          <Button
            title="📊 Track Progress"
            onPress={() => navigation.navigate('Progress')}
          />
          <Button
            title="📸 New Analysis"
            onPress={() => navigation.navigate('Camera')}
            variant="secondary"
          />
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
  header: {
    height: 300,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerDate: {
    ...typography.body,
    color: colors.white,
    fontWeight: '500',
  },
  scoreCard: {
    marginHorizontal: spacing.lg,
    marginTop: -40,
    padding: spacing.lg,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.bodySmall,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  confidenceText: {
    ...typography.caption,
    color: colors.gray,
    marginTop: spacing.sm,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: 0,
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
    width: 30,
  },
  distributionArea: {
    ...typography.bodySmall,
    color: colors.charcoal,
    textTransform: 'capitalize',
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
    borderRadius: borderRadius.full,
  },
  distributionPercent: {
    ...typography.caption,
    color: colors.gray,
    width: 40,
    textAlign: 'right',
  },
  // Summary
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  summaryEmoji: {
    fontSize: 24,
  },
  summaryText: {
    flex: 1,
    ...typography.body,
    color: colors.charcoal,
    lineHeight: 24,
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
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    ...typography.body,
    color: colors.charcoal,
  },
  // Actions
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
