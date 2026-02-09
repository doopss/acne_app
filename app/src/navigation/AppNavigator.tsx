import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { storage, StoredAnalysis } from '../lib/storage';
import {
  SplashScreen,
  Onboarding1Screen,
  Onboarding2Screen,
  Onboarding3Screen,
  Onboarding4Screen,
  PaywallScreen,
  HomeScreen,
  CameraScreen,
  AnalyzingScreen,
  FeedbackScreen,
  FeedbackDetailedScreen,
  ProductsScreen,
} from '../screens';
import { colors } from '../styles/theme';

// Type definitions
export type RootStackParamList = {
  // Onboarding flow
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Paywall: undefined;
  // Main app flow
  Home: undefined;
  Camera: undefined;
  Analyzing: { photoUri: string };
  Feedback: { analysisData: StoredAnalysis };
  FeedbackDetailed: { analysisData: StoredAnalysis };
  Products: { analysisData: StoredAnalysis };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppState = {
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  hasPurchased: boolean;
};

export function AppNavigator() {
  const [appState, setAppState] = useState<AppState>({
    isLoading: true,
    hasSeenOnboarding: false,
    hasPurchased: false,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { hasSeenOnboarding, hasPurchased } = await storage.getAppState();
        setAppState({
          isLoading: false,
          hasSeenOnboarding,
          hasPurchased,
        });
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppState({
          isLoading: false,
          hasSeenOnboarding: false,
          hasPurchased: false,
        });
      }
    };

    initializeApp();
  }, []);

  if (appState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Determine initial route based on app state
  const getInitialRoute = (): keyof RootStackParamList => {
    if (!appState.hasSeenOnboarding) {
      return 'Splash';
    }
    if (!appState.hasPurchased) {
      return 'Paywall';
    }
    return 'Home';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Onboarding1" 
          component={Onboarding1Screen}
        />
        <Stack.Screen 
          name="Onboarding2" 
          component={Onboarding2Screen}
        />
        <Stack.Screen 
          name="Onboarding3" 
          component={Onboarding3Screen}
        />
        <Stack.Screen 
          name="Onboarding4" 
          component={Onboarding4Screen}
        />
        <Stack.Screen 
          name="Paywall" 
          component={PaywallScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Main App Flow */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="Analyzing" 
          component={AnalyzingScreen}
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen 
          name="Feedback" 
          component={FeedbackScreen}
          options={{
            headerShown: true,
            headerTitle: 'Your Results',
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen 
          name="FeedbackDetailed" 
          component={FeedbackDetailedScreen}
          options={{
            headerShown: true,
            headerTitle: 'Detailed Analysis',
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen 
          name="Products" 
          component={ProductsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Products',
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
