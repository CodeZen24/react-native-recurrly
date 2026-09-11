import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <View>
      <Text>Subscription Details : {id}</Text>
      <Pressable accessibilityRole="button" onPress={handleGoBack}>
        <Text>Go Back</Text>
      </Pressable>
    </View>
  );
};

export default SubscriptionDetails;
