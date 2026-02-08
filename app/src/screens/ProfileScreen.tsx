import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../lib/auth';
import { Card, Button, SelectableOption } from '../components';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { PainPoint, BudgetTier, BeautyPhilosophy, SkinType } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const PAIN_POINTS = [
  { value: 'persistent_breakouts', label: 'Persistent Breakouts', emoji: '😔' },
  { value: 'scarring', label: 'Acne Scarring', emoji: '🩹' },
  { value: 'hormonal', label: 'Hormonal Acne', emoji: '🌙' },
  { value: 'blackheads', label: 'Blackheads', emoji: '⚫' },
  { value: 'oily_skin', label: 'Oily Skin', emoji: '💧' },
  { value: 'texture', label: 'Skin Texture', emoji: '🔘' },
];

const SKIN_TYPES = [
  { value: 'oily', label: 'Oily', emoji: '💦' },
  { value: 'dry', label: 'Dry', emoji: '🏜️' },
  { value: 'combination', label: 'Combination', emoji: '☯️' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸' },
];

const BUDGET_TIERS = [
  { value: 'under_50', label: 'Under $50', emoji: '💰' },
  { value: '50_150', label: '$50-150', emoji: '💎' },
  { value: '150_plus', label: '$150+', emoji: '✨' },
  { value: 'flexible', label: 'Flexible', emoji: '🎯' },
];

const PHILOSOPHIES = [
  { value: 'k_beauty', label: 'K-Beauty', emoji: '🇰🇷' },
  { value: 'western_clinical', label: 'Clinical', emoji: '🔬' },
  { value: 'clean', label: 'Clean Beauty', emoji: '🌿' },
  { value: 'minimalist', label: 'Minimalist', emoji: '📦' },
  { value: 'medical_grade', label: 'Medical Grade', emoji: '⚕️' },
];

export function ProfileScreen({ navigation }: Props) {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleUpdatePreference = async (
    key: 'pain_point' | 'skin_type' | 'budget_tier' | 'beauty_philosophy',
    value: string
  ) => {
    setSaving(true);
    await updateProfile({ [key]: value });
    setSaving(false);
    setEditing(null);
  };

  const getLabel = (options: { value: string; label: string }[], value: string | null) => {
    return options.find(o => o.value === value)?.label || 'Not set';
  };

  const getEmoji = (options: { value: string; emoji: string }[], value: string | null) => {
    return options.find(o => o.value === value)?.emoji || '❓';
  };

  const renderPreferenceSection = (
    title: string,
    key: 'pain_point' | 'skin_type' | 'budget_tier' | 'beauty_philosophy',
    options: { value: string; label: string; emoji: string }[],
    currentValue: string | null
  ) => {
    const isEditing = editing === key;

    return (
      <View style={styles.preferenceSection}>
        <TouchableOpacity
          style={styles.preferenceHeader}
          onPress={() => setEditing(isEditing ? null : key)}
        >
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>{title}</Text>
            <View style={styles.preferenceValue}>
              <Text style={styles.preferenceEmoji}>{getEmoji(options, currentValue)}</Text>
              <Text style={styles.preferenceLabel}>{getLabel(options, currentValue)}</Text>
            </View>
          </View>
          <Text style={styles.editIcon}>{isEditing ? '✕' : '✎'}</Text>
        </TouchableOpacity>

        {isEditing && (
          <View style={styles.preferenceOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionPill,
                  currentValue === option.value && styles.optionPillSelected,
                ]}
                onPress={() => handleUpdatePreference(key, option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    currentValue === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          {profile?.is_premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>✨ Premium</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.total_analyses || 0}</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {profile?.last_analysis_at 
                  ? new Date(profile.last_analysis_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never'}
              </Text>
              <Text style={styles.statLabel}>Last Scan</Text>
            </View>
          </View>
        </Card>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Your Preferences</Text>
        <Card>
          {renderPreferenceSection('Main Concern', 'pain_point', PAIN_POINTS, profile?.pain_point || null)}
          <View style={styles.preferenceDivider} />
          {renderPreferenceSection('Skin Type', 'skin_type', SKIN_TYPES, profile?.skin_type || null)}
          <View style={styles.preferenceDivider} />
          {renderPreferenceSection('Budget', 'budget_tier', BUDGET_TIERS, profile?.budget_tier || null)}
          <View style={styles.preferenceDivider} />
          {renderPreferenceSection('Skincare Style', 'beauty_philosophy', PHILOSOPHIES, profile?.beauty_philosophy || null)}
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Card>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Progress')}
          >
            <Text style={styles.actionEmoji}>📊</Text>
            <Text style={styles.actionLabel}>View Progress</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionLabel}>Support & Feedback</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionEmoji}>📋</Text>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        {/* Premium Upsell */}
        {!profile?.is_premium && (
          <Card style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>✨ Unlock Premium</Text>
            <Text style={styles.premiumDescription}>
              Get unlimited scans, detailed reports, and personalized routine builder
            </Text>
            <Button title="Learn More" variant="secondary" onPress={() => {}} />
          </Card>
        )}

        {/* Sign Out */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="ghost"
          style={styles.signOutButton}
          textStyle={styles.signOutText}
        />

        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  email: {
    ...typography.body,
    color: colors.charcoal,
    fontWeight: '500',
  },
  premiumBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  premiumText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.lightGray,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  preferenceSection: {
    paddingVertical: spacing.sm,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceInfo: {},
  preferenceTitle: {
    ...typography.caption,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  preferenceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  preferenceEmoji: {
    fontSize: 18,
  },
  preferenceLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.charcoal,
  },
  editIcon: {
    fontSize: 18,
    color: colors.primary,
    padding: spacing.xs,
  },
  preferenceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  optionPillSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionLabel: {
    ...typography.bodySmall,
    color: colors.charcoal,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  actionLabel: {
    flex: 1,
    ...typography.body,
    color: colors.charcoal,
  },
  actionArrow: {
    ...typography.body,
    color: colors.gray,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  premiumCard: {
    backgroundColor: colors.secondaryLight,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  premiumTitle: {
    ...typography.h3,
    color: colors.secondaryDark,
    marginBottom: spacing.xs,
  },
  premiumDescription: {
    ...typography.bodySmall,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  signOutButton: {
    marginTop: spacing.lg,
  },
  signOutText: {
    color: colors.error,
  },
  version: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
