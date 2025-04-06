import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { LinearGradient } from "expo-linear-gradient";

const fullResponse = `Paddy Field Disease Assessment and Management Plan

Looking at the image, I can see what appears to be a paddy field with rows of green plants showing some browning between rows. This pattern is consistent with early to mid-stage Sheath Blight infection, one of the most common and damaging diseases in rice cultivation.

Diagnosis Summary
The field shows symptoms of Sheath Blight, caused by the fungus Rhizoctonia solani. This disease thrives in waterlogged conditions and crowded plantings, attacking leaf sheaths and weakening stems. The characteristic greenish-gray lesions expand and make the plants fragile and prone to lodging, which can significantly reduce yield if left untreated.

Suggested Treatment
Organic Options:
• Apply Trichoderma biological control agents (2g/L), which naturally suppress the fungus without harming the environment.
• Use neem-based products which have demonstrated effectiveness against fungal diseases in paddy.
• Consider plant extract treatments like Cordia curassavica (10%), Aegle marmelos (15%), or Calotropis gigantea (5%) which have shown effectiveness against rice diseases.

If organic options prove insufficient:
• Apply fungicides like Hexaconazole (5% SC, 500ml/acre) or Validamycin at early disease stages.
• Propiconazole is effective as a systemic fungicide for sheath blight when applied preventively.

Environmental Impact Considerations
• Chemical fungicides may affect beneficial soil microorganisms and contaminate water bodies.
• Organic treatments like Trichoderma promote beneficial microbial diversity and enhance long-term soil resilience.
• Bio-organic fertilizers created from agricultural waste can enhance rice growth while improving soil health.
• Using resistant varieties and cultural practices reduces dependency on chemical treatments.

Preventive Steps for Nearby Crops
1. Cultural Management:
• Avoid flow of irrigation water from infected fields to healthy ones.
• Increase row spacing in nearby fields to improve air circulation.
• Maintain balanced nutrient application (avoid excessive nitrogen).
• Keep proper water management to avoid waterlogging.

2. For Other Fields:
• Scout regularly for early disease symptoms.
• Plant resistant varieties in areas prone to disease.
• Consider early planting to reduce risk of late-season diseases.

Timeline of Actions
Immediate (1–3 days):
• Scout entire field to assess extent of infection.
• Drain excess water to reduce humidity around plants.

Short-term (3–7 days):
• Apply biological control agents like Trichoderma or plant extracts.
• If severe, apply appropriate fungicide at recommended dosage.

Medium-term (2–4 weeks):
• Monitor disease progression and reapply treatments if necessary.
• Maintain proper water levels and avoid excess fertilization.

Long-term (next season):
• Practice deep ploughing and burn stubbles in summer to eliminate pathogen.
• Rotate crops to break disease cycle.
• Consider resistant varieties for fields with history of sheath blight.

This integrated approach combining biological, cultural, and if necessary, chemical controls will help manage the disease while maintaining long-term soil health and crop productivity.`;

export default function DroneScan() {
  const [displayedText, setDisplayedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setShowResponse(true);
      let index = 0;
      const words = fullResponse.split(" ");
      const interval = setInterval(() => {
        if (index < words.length) {
          setDisplayedText((prev) => prev + " " + words[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 35); // typing speed
    }, 5000); // 5 second delay

    return () => clearTimeout(delayTimer);
  }, []);

  return (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Scanning Completed</Text>
        <Text style={styles.subtitle}>Here are the images fetched</Text>

        <View style={styles.imageGrid}>
          <Image source={require("../../assets/images/crop1.png")} style={styles.image} />
          <Image source={require("../../assets/images/crop2.png")} style={styles.image} />
          <Image source={require("../../assets/images/crop3.png")} style={styles.image} />
          <Image source={require("../../assets/images/crop4.png")} style={styles.image} />
        </View>

        <Text style={styles.analysisHeading}>Analyzing images...</Text>

        <View style={styles.responseCard}>
          <Text style={styles.responseText}>{displayedText}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.Bold,
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  image: {
    width: "48%",
    height: 160,
    marginBottom: 12,
    borderRadius: 12,
  },
  analysisHeading: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primaryDark,
    marginBottom: 12,
  },
  responseCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  responseText: {
    fontFamily: fonts.Regular,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
});
