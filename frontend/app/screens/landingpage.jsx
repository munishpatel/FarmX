import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";

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

  return (
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
                <Text style={styles.todayText}>Today: {weatherData[0]?.main.temp}°C</Text>
                <Text>{weatherData[0]?.weather[0].description}</Text>
              </View>

              {/* Next 6 Days */}
              <FlatList
                data={weatherData.slice(1)} // Next 6 days
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.forecastItem}>
                    <Text style={styles.dayText}>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                    <Text>{item.main.temp}°C</Text>
                    <Text>{item.weather[0].description}</Text>
                  </View>
                )}
              />
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  weatherContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  todayWeather: {
    alignItems: "center",
    marginBottom: 10,
  },
  todayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  forecastItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

