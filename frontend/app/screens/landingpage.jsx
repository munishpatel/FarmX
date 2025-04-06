import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { router } from 'expo-router';

export default function LandingPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "8470c1a546a21ba05872e39a784dd05f";
        const city = "Chicago";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`
        );
        const data = await response.json();
        if (data.list) {
          const dailyForecast = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );
          setWeatherData(dailyForecast);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWeather();
  }, []);
  

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const formatDay = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/farm-background.jpg')} 
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)']}
        style={styles.gradientOverlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.appName}>FarmR.ai</Text>
            <Text style={styles.tagline}>Plant once, harvest always!</Text> 
            <Text style={styles.tagline}>Farming Reimagined with the power of AI/ML & dynamic UI.</Text>
          </View>

          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Your farm insights are ready</Text>
            <View style={styles.divider} />
            <Text style={styles.welcomeMessage}>Today is a great day to check your crops and get the latest recommendations from our AI.</Text>
          </View>

          <View style={styles.weatherCard}>
            <Text style={styles.cardTitle}>Local Weather Forecast</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              weatherData && (
                <View>
                  {/* Today's Weather Highlight */}
                  <View style={styles.currentWeather}>
                    <View style={styles.weatherMain}>
                      <Text style={styles.currentTemp}>{Math.round(weatherData[0]?.main.temp)}°C</Text>
                      <Image
                        source={{ uri: getWeatherIcon(weatherData[0]?.weather[0].icon) }}
                        style={styles.currentWeatherIcon}
                      />
                    </View>
                    <Text style={styles.weatherDescription}>{weatherData[0]?.weather[0].description}</Text>
                    <Text style={styles.weatherLocation}>Chicago, IL</Text>
                  </View>

                  {/* 7-Day Forecast */}
                  <View style={styles.forecastContainer}>
                    {weatherData.slice(0, 7).map((item) => (
                      <View key={item.dt} style={styles.forecastDay}>
                        <Text style={styles.forecastDayText}>{formatDay(item.dt)}</Text>
                        <Image
                          source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                          style={styles.forecastIcon}
                        />
                        <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            {/* First Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/screens/crop-health")}>
                <View style={[styles.actionIconContainer, styles.healthIcon]}>
                  <Image source={require("../../assets/images/crop-health.png")} style={styles.actionIcon} />
                </View>
                <Text style={styles.actionTitle}>Crop Health</Text>
                <Text style={styles.actionSubtitle}>Check your fields</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/screens/ai-insights")}>
                <View style={[styles.actionIconContainer, styles.insightsIcon]}>
                  <Image source={require("../../assets/images/ai-insights.png")} style={styles.actionIcon} />
                </View>
                <Text style={styles.actionTitle}>AI Insights</Text>
                <Text style={styles.actionSubtitle}>Latest predictions</Text>
              </TouchableOpacity>
            </View>
    
            {/* Second Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/screens/recommendations")}>
                <View style={[styles.actionIconContainer, styles.recommendationsIcon]}>
                  <Image source={require("../../assets/images/recommendations.png")} style={styles.actionIcon} />
                </View>
                <Text style={styles.actionTitle}>Recommendations</Text>
                <Text style={styles.actionSubtitle}>Personalized suggestions</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/screens/assistant")}>
                <View style={[styles.actionIconContainer, styles.assistantIcon]}>
                  <Image source={require("../../assets/images/assistant.png")} style={styles.actionIcon} />
                </View>
                <Text style={styles.actionTitle}>Assistant</Text>
                <Text style={styles.actionSubtitle}>Ask FarmR.ai</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',

  },
  gradientOverlay: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeTitle: {
    fontSize: 26,
    fontFamily: fonts.SemiBold,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.text,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryLight,
    marginVertical: 12,
  },
  welcomeMessage: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.primaryDark,
    marginBottom: 16,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentTemp: {
    fontSize: 52,
    fontFamily: fonts.Bold,
    color: colors.text,
    marginRight: 10,
  },
  currentWeatherIcon: {
    width: 80,
    height: 80,
  },
  weatherDescription: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.text,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  weatherLocation: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  forecastDay: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    width: '12%',
    minWidth: 50,
  },
  forecastDayText: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.text,
    marginBottom: 8,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.text,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthIcon: {
    backgroundColor: '#E3F2FD',
  },
  insightsIcon: {
    backgroundColor: '#E8F5E9',
  },
  recommendationsIcon: {
    backgroundColor: '#FFF8E1',
  },
  assistantIcon: {
    backgroundColor: '#F3E5F5',
  },
  actionIcon: {
    width: 34,
    height: 34,
    tintColor: colors.primaryDark,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});