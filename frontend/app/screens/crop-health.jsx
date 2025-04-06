import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { router } from "expo-router";

export default function CropHealth() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Section with Background Image */}
      <ImageBackground
        source={require("../../assets/images/crop-drone.png")}
        style={styles.topSection}
        resizeMode="cover"
        blurRadius={1}
      >
        <TouchableOpacity
          style={styles.droneButton}
          onPress={() => router.push("/screens/dronescan")}
        >
          <Text style={styles.droneButtonText}>Launch Drone</Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* Green Gradient Background Section */}
      <LinearGradient
        colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
        style={styles.gradientSection}
      >
        <View style={styles.infoCard}>
          <Text style={styles.title}>Crop Health Status</Text>
          <Text style={styles.description}>
            Our AI-powered drone captures real-time images of your fields and identifies issues like pest damage,
            water stress, or nutrient deficiency. Stay updated with detailed visual insights and recommendations
            to improve your crop yield.
          </Text>
        </View>

        <Image 
          source={require("../../assets/images/crop-health-analysis.png")} 
          style={styles.analysisImage} 
        />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: '#E8F5E9',
  },
  topSection: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  droneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  droneButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
  },
  gradientSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.primaryDark,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
    lineHeight: 22,
  },
  analysisImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
});
