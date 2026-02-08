import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, getOverallScoreColor } from '../styles/theme';

interface ScoreCircleProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreCircle({ score, size = 160, label = 'Skin Score' }: ScoreCircleProps) {
  const scoreColor = getOverallScoreColor(score);
  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Needs Work';
    return 'Attention Needed';
  };

  // Calculate stroke dasharray for progress ring
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View
        style={[
          styles.backgroundRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />
      
      {/* Progress ring using SVG would be better, but this is a CSS approximation */}
      <View
        style={[
          styles.progressRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: scoreColor,
            borderRightColor: 'transparent',
            borderBottomColor: score > 50 ? scoreColor : 'transparent',
            borderLeftColor: score > 25 ? scoreColor : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />

      {/* Inner content */}
      <View style={styles.innerContent}>
        <Text style={[styles.score, { color: scoreColor }]}>{Math.round(score)}</Text>
        <Text style={styles.outOf}>/ 100</Text>
        <Text style={[styles.label, { color: scoreColor }]}>{getScoreLabel()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundRing: {
    position: 'absolute',
    borderColor: colors.lightGray,
  },
  progressRing: {
    position: 'absolute',
  },
  innerContent: {
    alignItems: 'center',
  },
  score: {
    fontSize: 48,
    fontWeight: '700',
  },
  outOf: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: -4,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginTop: 4,
  },
});
