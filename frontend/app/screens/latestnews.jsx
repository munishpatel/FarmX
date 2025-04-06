import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";

const newsData = [
  {
    id: 1,
    title: "Chelsea Gazillo Supports California Policy for Agriculture and Food",
    image: require("../../assets/images/news1.png"),
  },
  {
    id: 2,
    title: "Embracing Slowness: Commitment to the Vision of Sustainable Agriculture",
    image: require("../../assets/images/news2.png"),
  },
  {
    id: 3,
    title: "Sustainable Practices Across U.S. States",
    image: require("../../assets/images/news3.png"),
  },
];

export default function LatestNews() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Latest news</Text>

      {newsData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>▶ Play Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>⬇ Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    textAlign: "center",
    marginBottom: 24,
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    marginBottom: 12,
    textAlign: "center",
    color: colors.text,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.SemiBold,
    fontSize: 14,
  },
});
