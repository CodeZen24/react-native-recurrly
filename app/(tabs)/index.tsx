import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white p-4">
        <Text>Go to Onboarding</Text>
      </Link>
      <Link href="/(auth)/SignIn" className="mt-4 rounded bg-primary text-white p-4">
        <Text>Go to Sign In</Text>
      </Link>
      <Link href="/(auth)/SignUp" className="mt-4 rounded bg-primary text-white p-4">
        <Text>Go to Sign Up</Text>
      </Link>

      <Link href="/subscriptions/spotify">Spotify Subscription</Link>
      <Link
      href= {{
        pathname: "/subscriptions/[id]",
        params: {id : "claude"}
      }}
      >
        Claude Max Subscription
      </Link>

    </View>
  );
}
