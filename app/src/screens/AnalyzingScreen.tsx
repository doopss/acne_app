import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { analyzeImageWithGemini } from '../lib/gemini';
import { storage, StoredAnalysis } from '../lib/storage';
import { colors, spacing, typography } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { photoUri: string } }, 'params'>;
};

const ANALYSIS_STEPS = [
  { label: 'Processing image...', emoji: '📸' },
  { label: 'Detecting skin type...', emoji: '🔍' },
  { label: 'Analyzing acne patterns...', emoji: '🎯' },
  { label: 'Measuring hydration levels...', emoji: '💧' },
  { label: 'Evaluating texture...', emoji: '✨' },
  { label: 'Generating insights...', emoji: '🧠' },
];

export function AnalyzingScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start spinner animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2000);

    // Perform actual analysis
    analyzeImage();

    return () => clearInterval(stepInterval);
  }, []);

  const analyzeImage = async () => {
    try {
      // Read image as base64
      const base64Image = await FileSystem.readAsStringAsync(photoUri, {
        encoding: 'base64',
      });

      // Analyze with Gemini
      const analysisResult = await analyzeImageWithGemini(base64Image);

      // Create stored analysis object
      const storedAnalysis: StoredAnalysis = {
        id: `analysis_${Date.now()}`,
        createdAt: new Date().toISOString(),
        photoUri: photoUri,
        result: analysisResult,
      };

      // Save to local storage
      await storage.setLastAnalysis(storedAnalysis);

      // Navigate to feedback screen
      navigation.replace('Feedback', { analysisData: storedAnalysis });

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to analyze your image. Please try again.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currentStepData = ANALYSIS_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated spinner */}
        <View style={styles.spinnerContainer}>
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <View style={styles.spinnerDot} />
          </Animated.View>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{currentStepData.emoji}</Text>
          </View>
        </View>

        {/* Status text */}
        <Text style={styles.title}>Analyzing Your Skin</Text>
        <Text style={styles.stepLabel}>{currentStepData.label}</Text>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {ANALYSIS_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Info text */}
        <Text style={styles.infoText}>
          Our AI is analyzing multiple factors including texture, hydration, and inflammation
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  spinnerContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  spinner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: colors.lightGray,
    borderTopColor: colors.primary,
  },
  spinnerDot: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  stepLabel: {
    ...typography.body,
    color: colors.darkGray,
    marginBottom: spacing.lg,
  },
  progressDots: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.3 }],
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
