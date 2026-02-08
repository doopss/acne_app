import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { analyzeImageWithGemini } from '../lib/gemini';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function CameraScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
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

  const analyzeImage = async () => {
    if (!capturedImage || !user) return;

    setAnalyzing(true);

    try {
      // Read image as base64
      const base64Image = await FileSystem.readAsStringAsync(capturedImage, {
        encoding: 'base64',
      });

      // Upload image to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, decode(base64Image), {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      // Analyze with Gemini
      const analysisResult = await analyzeImageWithGemini(base64Image);

      // Save analysis to database
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          photo_storage_path: fileName,
          acne_type: analysisResult.acne_type,
          severity: analysisResult.severity,
          distribution: analysisResult.distribution,
          hydration_score: analysisResult.scores.hydration,
          texture_score: analysisResult.scores.texture,
          inflammation_score: analysisResult.scores.inflammation,
          clarity_score: analysisResult.scores.clarity,
          pore_score: analysisResult.scores.pores,
          dark_spots_score: analysisResult.scores.dark_spots,
          overall_score: analysisResult.scores.overall,
          ai_response: analysisResult,
          ai_model: 'gemini-2.0-flash',
          ai_confidence: analysisResult.confidence,
        })
        .select()
        .single();

      if (analysisError) {
        console.error('Analysis save error:', analysisError);
        throw new Error('Failed to save analysis');
      }

      // Generate and save recommendations
      await generateRecommendations(analysisData.id, analysisResult);

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({
          total_analyses: supabase.rpc('increment_analyses'),
          last_analysis_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      // Navigate to results
      navigation.replace('Results', { analysisId: analysisData.id });

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to analyze your image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const generateRecommendations = async (analysisId: string, analysisResult: any) => {
    try {
      // Fetch products that match user's profile
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(10);

      if (productsError || !products) return;

      // Simple recommendation logic based on acne type and scores
      const sortedProducts = products
        .filter(p => 
          p.acne_type?.includes(analysisResult.acne_type) ||
          p.product_type === 'treatment'
        )
        .slice(0, 5);

      // Save recommendations
      const recommendations = sortedProducts.map((product, index) => ({
        analysis_id: analysisId,
        product_id: product.id,
        rank: index + 1,
        reasoning: getReasoningForProduct(product, analysisResult),
        usage_instructions: getUsageInstructions(product),
        expected_results: '4-6 weeks for visible improvement',
        routine_step: getRoutineStep(product.product_type),
        time_of_day: getTimeOfDay(product.product_type),
      }));

      await supabase.from('recommendations').insert(recommendations);

      // Update analysis with recommendations count
      await supabase
        .from('analyses')
        .update({ recommendations_count: recommendations.length })
        .eq('id', analysisId);

    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const getReasoningForProduct = (product: any, analysis: any) => {
    const reasons = [];
    if (product.key_ingredients?.includes('salicylic_acid')) {
      reasons.push('Salicylic acid helps unclog pores');
    }
    if (product.key_ingredients?.includes('niacinamide')) {
      reasons.push('Niacinamide reduces inflammation');
    }
    if (product.key_ingredients?.includes('benzoyl_peroxide')) {
      reasons.push('Benzoyl peroxide kills acne-causing bacteria');
    }
    if (product.suitable_for_sensitive) {
      reasons.push('Gentle formula suitable for sensitive skin');
    }
    return reasons.length > 0 ? reasons.join('. ') + '.' : 'Effective for your skin concerns.';
  };

  const getUsageInstructions = (product: any) => {
    switch (product.product_type) {
      case 'cleanser': return 'Use morning and night. Massage onto damp skin, rinse thoroughly.';
      case 'treatment': return 'Apply a thin layer to affected areas after cleansing.';
      case 'moisturizer': return 'Apply after treatments, morning and night.';
      case 'sunscreen': return 'Apply as final step in morning routine. Reapply every 2 hours.';
      default: return 'Follow product directions.';
    }
  };

  const getRoutineStep = (productType: string | null) => {
    switch (productType) {
      case 'cleanser': return 1;
      case 'treatment': return 2;
      case 'moisturizer': return 3;
      case 'sunscreen': return 4;
      default: return 2;
    }
  };

  const getTimeOfDay = (productType: string | null) => {
    if (productType === 'sunscreen') return ['morning'];
    if (productType === 'treatment') return ['night'];
    return ['morning', 'night'];
  };

  // Base64 decode helper
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
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
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your skin. Your photos are private and secure.
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
          
          {analyzing ? (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={styles.analyzingText}>Analyzing your skin...</Text>
              <Text style={styles.analyzingSubtext}>This may take a few seconds</Text>
            </View>
          ) : (
            <View style={styles.previewActions}>
              <Button
                title="Retake"
                onPress={() => setCapturedImage(null)}
                variant="outline"
                style={styles.retakeButton}
              />
              <Button
                title="Analyze"
                onPress={analyzeImage}
                style={styles.analyzeButton}
              />
            </View>
          )}
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
          <TouchableOpacity onPress={pickImage} style={styles.galleryIconButton}>
            <Text style={styles.controlIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCameraType(cameraType === 'front' ? 'back' : 'front')}
            style={styles.flipButton}
          >
            <Text style={styles.controlIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📌 Tips for best results:</Text>
          <Text style={styles.tipItem}>• Good lighting (natural light is best)</Text>
          <Text style={styles.tipItem}>• Clean, bare skin (no makeup)</Text>
          <Text style={styles.tipItem}>• Face the camera directly</Text>
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
    borderColor: colors.white + '80',
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.black + 'CC',
  },
  galleryIconButton: {
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
    borderColor: colors.white,
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 36,
    backgroundColor: colors.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  tipsContainer: {
    padding: spacing.md,
    backgroundColor: colors.charcoal,
  },
  tipsTitle: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tipItem: {
    ...typography.caption,
    color: colors.lightGray,
    marginTop: 2,
  },
  // Permission state
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  permissionEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.body,
    color: colors.gray,
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
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black + 'DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    ...typography.h3,
    color: colors.white,
    marginTop: spacing.lg,
  },
  analyzingSubtext: {
    ...typography.body,
    color: colors.lightGray,
    marginTop: spacing.xs,
  },
});
