import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button, Card, ScoreCircle, ProductCard } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Analysis, Product, Recommendation } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function HomeScreen({ navigation }: Props) {
  const { user, profile } = useAuth();
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
  const [topProducts, setTopProducts] = useState<(Recommendation & { product: Product })[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch latest analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!analysisError && analysisData) {
        setLatestAnalysis(analysisData);

        // Fetch recommendations for latest analysis
        const { data: recsData } = await supabase
          .from('recommendations')
          .select(`
            *,
            product:products(*)
          `)
          .eq('analysis_id', analysisData.id)
          .order('rank', { ascending: true })
          .limit(3);

        if (recsData) {
          setTopProducts(recsData as any);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} ✨</Text>
            <Text style={styles.welcomeText}>Ready to check your skin?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Scan Button */}
        <Card style={styles.scanCard} variant="elevated">
          <View style={styles.scanContent}>
            <Text style={styles.scanTitle}>Take a Skin Analysis</Text>
            <Text style={styles.scanDescription}>
              Get personalized recommendations based on AI analysis of your skin
            </Text>
            <Button
              title="📸 Start Scan"
              onPress={() => navigation.navigate('Camera')}
              size="large"
              style={styles.scanButton}
            />
          </View>
        </Card>

        {/* Latest Analysis */}
        {latestAnalysis && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Latest Results</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Results', { analysisId: latestAnalysis.id })}
              >
                <Text style={styles.seeAllLink}>View Details →</Text>
              </TouchableOpacity>
            </View>
            
            <Card style={styles.resultsCard}>
              <View style={styles.resultsTop}>
                <ScoreCircle score={latestAnalysis.overall_score || 0} size={120} />
                <View style={styles.resultsInfo}>
                  <Text style={styles.resultsDate}>
                    {formatDate(latestAnalysis.created_at)}
                  </Text>
                  <View style={styles.resultsBadge}>
                    <Text style={styles.badgeText}>
                      {latestAnalysis.severity || 'Unknown'} • {latestAnalysis.acne_type || 'Mixed'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.trackProgressButton}
                    onPress={() => navigation.navigate('Progress')}
                  >
                    <Text style={styles.trackProgressText}>📈 Track Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* No Analysis Yet */}
        {!latestAnalysis && !loading && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No Analysis Yet</Text>
            <Text style={styles.emptyDescription}>
              Take your first skin scan to get personalized insights and product recommendations
            </Text>
          </Card>
        )}

        {/* Top Recommendations */}
        {topProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Results', { 
                  analysisId: latestAnalysis?.id,
                  scrollTo: 'recommendations'
                })}
              >
                <Text style={styles.seeAllLink}>See All →</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScroll}
            >
              {topProducts.map((rec) => (
                <ProductCard
                  key={rec.id}
                  product={rec.product}
                  recommendation={rec}
                  compact
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skincare Tips</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsScroll}
          >
            <Card style={styles.tipCard}>
              <Text style={styles.tipEmoji}>💧</Text>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipText}>Drink 8 glasses of water daily</Text>
            </Card>
            <Card style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🌙</Text>
              <Text style={styles.tipTitle}>Sleep Well</Text>
              <Text style={styles.tipText}>7-9 hours helps skin repair</Text>
            </Card>
            <Card style={styles.tipCard}>
              <Text style={styles.tipEmoji}>☀️</Text>
              <Text style={styles.tipTitle}>Wear SPF</Text>
              <Text style={styles.tipText}>Protect from sun damage</Text>
            </Card>
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.charcoal,
  },
  welcomeText: {
    ...typography.body,
    color: colors.gray,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  scanCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  scanContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  scanTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  scanDescription: {
    ...typography.bodySmall,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scanButton: {
    width: '100%',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
  },
  seeAllLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  resultsCard: {
    padding: spacing.md,
  },
  resultsTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultsDate: {
    ...typography.bodySmall,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  resultsBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark,
    textTransform: 'capitalize',
  },
  trackProgressButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  trackProgressText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
  productsScroll: {
    paddingRight: spacing.lg,
  },
  tipsScroll: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  tipCard: {
    width: 140,
    alignItems: 'center',
    padding: spacing.md,
  },
  tipEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  tipTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: 2,
  },
  tipText: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
  },
});
