import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";


import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold">
        Home
      </Text>
      <Link href="/onboarding" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4">
        <Text>Go to Onboarding</Text>
      </Link>
      <Link href="/(auth)/SignIn" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4">
        <Text>Go to Sign In</Text>
      </Link>
      <Link href="/(auth)/SignUp" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4">
        <Text>Go to Sign Up</Text>
      </Link>
    </SafeAreaView>
  );
}
