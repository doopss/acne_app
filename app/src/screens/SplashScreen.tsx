import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { colors, spacing, typography } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function SplashScreen({ navigation }: Props) {
  const handleGetStarted = () => {
    navigation.navigate('Onboarding1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
          <Text style={styles.appName}>ClearSkin</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Clear skin starts with{'\n'}understanding your skin
        </Text>

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeDot, styles.dot1]} />
          <View style={[styles.decorativeDot, styles.dot2]} />
          <View style={[styles.decorativeDot, styles.dot3]} />
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          size="large"
        />
        <Text style={styles.privacyText}>
          Your photos are analyzed locally and never stored
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 48,
    color: colors.white,
  },
  appName: {
    ...typography.h1,
    color: colors.charcoal,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.h3,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 32,
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorativeDot: {
    position: 'absolute',
    borderRadius: 100,
  },
  dot1: {
    width: 120,
    height: 120,
    backgroundColor: colors.primaryLight,
    opacity: 0.5,
    top: '10%',
    right: -30,
  },
  dot2: {
    width: 80,
    height: 80,
    backgroundColor: colors.secondaryLight,
    opacity: 0.5,
    bottom: '20%',
    left: -20,
  },
  dot3: {
    width: 60,
    height: 60,
    backgroundColor: colors.accentLight,
    opacity: 0.5,
    top: '30%',
    left: '10%',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  privacyText: {
    ...typography.caption,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
