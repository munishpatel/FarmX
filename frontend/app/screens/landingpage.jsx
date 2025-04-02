import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";

export default function LandingPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "8470c1a546a21ba05872e39a784dd05f";
        const city = "Chicago";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=7&appid=${apiKey}`
        );
        const data = await response.json();
        if (data.list) {
          setWeatherData(data.list);
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
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>FarmR.ai</Text>
          <Text style={styles.tagline}>Plant once, harvest always!</Text> 
          <Text style={styles.tagline}>Farm smarter, using our AI that sees, speaks, and understands and that grows with your farm.</Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>Your farm insights are ready</Text>
        </View>

        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>Local Weather Forecast</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
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
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Crop Health</Text>
            <Text style={styles.actionSubtitle}>Check your fields</Text>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>AI Insights</Text>
            <Text style={styles.actionSubtitle}>Latest predictions</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
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
    fontSize: 36,
    fontFamily: fonts.Bold,
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.text,
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
    fontSize: 48,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
});