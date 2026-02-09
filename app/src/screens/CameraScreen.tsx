import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function CameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        if (photo?.uri) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleAnalyze = () => {
    if (capturedImage) {
      navigation.replace('Analyzing', { photoUri: capturedImage });
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera Access</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your skin. Photos are processed securely and never stored.
          </Text>
          <Button title="Grant Access" onPress={requestPermission} />
          <TouchableOpacity onPress={pickImage} style={styles.galleryButton}>
            <Text style={styles.galleryButtonText}>Or choose from gallery</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewActions}>
            <Button
              title="Retake"
              onPress={() => setCapturedImage(null)}
              variant="outline"
              style={styles.retakeButton}
            />
            <Button
              title="Analyze"
              onPress={handleAnalyze}
              style={styles.analyzeButton}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
        >
          {/* Face guide overlay */}
          <View style={styles.guideOverlay}>
            <View style={styles.guideCircle} />
            <Text style={styles.guideText}>Position your face in the circle</Text>
          </View>
        </CameraView>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={pickImage} style={styles.sideButton}>
            <Text style={styles.controlIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCameraType(cameraType === 'front' ? 'back' : 'front')}
            style={styles.sideButton}
          >
            <Text style={styles.controlIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>☀️</Text>
            <Text style={styles.tipText}>Good lighting</Text>
          </View>
          <View style={styles.tipDot} />
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>🧼</Text>
            <Text style={styles.tipText}>Clean skin</Text>
          </View>
          <View style={styles.tipDot} />
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>😐</Text>
            <Text style={styles.tipText}>Face forward</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  permissionIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  permissionIcon: {
    fontSize: 48,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  permissionText: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  galleryButton: {
    marginTop: spacing.md,
    padding: spacing.md,
  },
  galleryButtonText: {
    ...typography.body,
    color: colors.primary,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  guideOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCircle: {
    width: 280,
    height: 350,
    borderRadius: 175,
    borderWidth: 3,
    borderColor: colors.primary + '80',
    borderStyle: 'dashed',
  },
  guideText: {
    ...typography.body,
    color: colors.white,
    marginTop: spacing.md,
    textShadowColor: colors.black,
    textShadowRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.black + 'E6',
    gap: spacing.xl,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.primary,
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 36,
    backgroundColor: colors.primary,
  },
  controlIcon: {
    fontSize: 24,
  },
  tipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.charcoal,
    gap: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipText: {
    ...typography.caption,
    color: colors.lightGray,
  },
  tipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkGray,
  },
  // Preview state
  previewContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.black,
  },
  retakeButton: {
    flex: 1,
    borderColor: colors.white,
  },
  analyzeButton: {
    flex: 1,
  },
});
