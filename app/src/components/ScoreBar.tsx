import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, getScoreColor } from '../styles/theme';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ScoreBar({
  label,
  score,
  maxScore = 10,
  showValue = true,
  size = 'medium',
}: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;
  const scoreColor = getScoreColor(score);

  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.header}>
        <Text style={[styles.label, styles[`${size}Label`]]}>{label}</Text>
        {showValue && (
          <Text style={[styles.value, { color: scoreColor }]}>
            {score.toFixed(1)}/{maxScore}
          </Text>
        )}
      </View>
      <View style={[styles.track, styles[`${size}Track`]]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: scoreColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  small: {},
  medium: {},
  large: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.charcoal,
    fontWeight: '500',
  },
  smallLabel: {
    fontSize: 12,
  },
  mediumLabel: {
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 16,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  track: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  smallTrack: {
    height: 6,
  },
  mediumTrack: {
    height: 8,
  },
  largeTrack: {
    height: 12,
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
