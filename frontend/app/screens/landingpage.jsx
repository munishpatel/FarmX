import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import GradientBackground from "../../components/gradient"; 

export default function LandingPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "8470c1a546a21ba05872e39a784dd05f"; // Replace with your API key
        const city = "Chicago"; // You can make this dynamic
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
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDay = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Landing Page!</Text>
        <Text style={styles.subtitle}>You are now logged in.</Text>

        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>Weather Forecast</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            weatherData && (
              <View>
                {/* Today's Weather */}
                <View style={styles.todayWeather}>
                  <Text style={styles.todayTemp}>{Math.round(weatherData[0]?.main.temp)}°C</Text>
                  <Image
                    source={{ uri: getWeatherIcon(weatherData[0]?.weather[0].icon) }}
                    style={styles.weatherIcon}
                  />
                  <Text style={styles.todayDesc}>{weatherData[0]?.weather[0].description}</Text>
                </View>

                {/* Next 6 Days */}
                <View style={styles.forecastList}>
                  {weatherData.slice(1).map((item) => (
                    <View key={item.dt} style={styles.forecastItem}>
                      <Text style={styles.dayText}>{formatDay(item.dt)}</Text>
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
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center", // Center content vertically
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333", // Darker text for better contrast
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  weatherContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
    borderRadius: 10,
    alignItems: "center",
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  todayWeather: {
    alignItems: "center",
    marginBottom: 10,
  },
  todayTemp: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  todayDesc: {
    fontSize: 16,
    color: "#555",
  },
  forecastList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  forecastItem: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  forecastIcon: {
    width: 30,
    height: 30,
  },
  forecastTemp: {
    fontSize: 14,
    color: "#555",
  },
});