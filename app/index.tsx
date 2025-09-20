import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect alla home dei tab
  return <Redirect href="/(tabs)" />;
}