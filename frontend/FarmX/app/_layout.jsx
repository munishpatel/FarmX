import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Automatically connects screens */}
      <Stack.Screen name="(tabs)/index" options={{ title: 'Home' }} />
      <Stack.Screen name="screens/login" options={{ title: 'Login' }} />
      <Stack.Screen name="screens/signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="screens/landingpage" options={{ title: 'Landing Page' }} />
    </Stack>
  );
}
