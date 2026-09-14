import { useAuth, useUser } from '@clerk/expo';
import { styled } from "nativewind";
import React from 'react';
import { Text, Pressable, View, Image } from 'react-native';
import dayjs from 'dayjs';

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { posthog } from '@/lib/posthog';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    posthog?.capture('signed_out');
    posthog?.reset();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <Text className="text-3xl font-sans-bold text-primary mt-6 mb-10">Settings</Text>
        
        {/* Profile Card */}
        <View className="rounded-3xl border border-border bg-card p-6 mb-6 flex-row items-center gap-5">
          <Image 
            source={{ uri: user?.imageUrl }} 
            className="size-16 rounded-full" 
          />
          <View className="flex-1">
            <Text className="text-xl font-sans-bold text-primary">{user?.fullName || "User"}</Text>
            <Text className="text-sm font-sans-medium text-muted-foreground mt-1.5">
              {user?.primaryEmailAddress?.emailAddress || "No email provided"}
            </Text>
          </View>
        </View>

        {/* Account Info Card */}
        <View className="rounded-3xl border border-border bg-card px-6 py-7 mb-8">
          <Text className="text-lg font-sans-bold text-primary mb-6">Account</Text>
          
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
            <Text className="text-sm font-sans-medium text-primary">
              {user?.id ? (user.id.length > 22 ? user.id.slice(0, 22) + "..." : user.id) : "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
            <Text className="text-sm font-sans-medium text-primary">
              {user?.createdAt ? dayjs(user.createdAt).format("DD. MM. YYYY.") : "N/A"}
            </Text>
          </View>
        </View>
        
        {/* Sign Out Button */}
        <Pressable 
          onPress={handleSignOut}
          className="bg-accent py-5 rounded-full items-center shadow-sm"
        >
          <Text className="text-primary font-sans-bold text-lg">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;