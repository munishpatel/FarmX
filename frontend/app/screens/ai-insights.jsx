import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

export default function AiInsights() {
  const [land, setLand] = useState('');
  const [crop, setCrop] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [farmingType, setFarmingType] = useState('Organic');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [resultText, setResultText] = useState('');

  return (
    <LinearGradient colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.pageTitle}>AI Insights</Text>

        {/* 1. Water Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Management</Text>
          <View style={styles.insightRow}>
            <Image source={require('../../assets/images/moisture-pie.png')} style={styles.chartImage} />
            <Image source={require('../../assets/images/water-timeline.png')} style={styles.chartImage} />
          </View>
          <Text style={styles.sectionText}>
            Based on your farm’s data, we recommend adjusting your watering schedule during early mornings for better absorption and reduced evaporation.
          </Text>
        </View>

        {/* 2. Fertilizer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fertilizer</Text>
          <Image source={require('../../assets/images/fertilizer-bar.png')} style={styles.chartImageFull} />
          <Text style={styles.sectionText}>
            The fertilizers used had moderate environmental impact. Consider reducing nitrogen-based fertilizers and increasing compost or organic options for sustainability.
          </Text>
        </View>

        {/* 3. Seeds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seeds</Text>

          <Text style={styles.inputLabel}>Acres of land being used:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={land}
            onChangeText={setLand}
          />

          <Text style={styles.inputLabel}>Type of crop:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Wheat"
            value={crop}
            onChangeText={setCrop}
          />

          <Text style={styles.inputLabel}>Planned harvest date:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. July 2025"
            value={harvestDate}
            onChangeText={setHarvestDate}
          />

          <Text style={styles.inputLabel}>Irrigation availability:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Drip Irrigation"
            value={irrigation}
            onChangeText={setIrrigation}
          />

          <Text style={styles.inputLabel}>Farming Type:</Text>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdown}>
            <Text style={styles.dropdownText}>{farmingType}</Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownOptions}>
              {['Organic', 'Non-GMO'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setFarmingType(option);
                    setDropdownVisible(false);
                  }}
                  style={styles.dropdownOption}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (!land || !crop || !harvestDate || !irrigation) {
                setResultText("Please fill all the fields to get a result.");
                return;
              }

              const landAcres = parseFloat(land);
              const yieldEstimate = landAcres * 1000;
              const seedEstimate = landAcres * 25;

              const result = `Based on your input of ${landAcres} acres for ${crop},\n\nEstimated Yield: ~${yieldEstimate} kg\nRequired Seeds: ~${seedEstimate} units.\n\nEnsure irrigation availability: "${irrigation}" and farming type: "${farmingType}" are optimal for best results.`;

              setResultText(result);
            }}
          >
            <Text style={styles.submitText}>Submit Plan</Text>
          </TouchableOpacity>

          {resultText !== '' && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{resultText}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    color: colors.primaryDark,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.text,
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartImage: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  chartImageFull: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    marginTop: 10,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.text,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.text,
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  dropdownOptions: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
  resultBox: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  resultText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.text,
    lineHeight: 20,
    whiteSpace: 'pre-line',
  },
});
