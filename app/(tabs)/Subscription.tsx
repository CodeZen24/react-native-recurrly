import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View, type ListRenderItemInfo } from 'react-native';

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionScreen = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const toggleSubscription = useCallback((id: string) => {
    setExpandedSubscriptionId((currentId) => (currentId === id ? null : id));
  }, []);

  const renderSubscription = useCallback(
    ({ item }: ListRenderItemInfo<Subscription>) => (
      <SubscriptionCard
        {...item}
        expanded={expandedSubscriptionId === item.id}
        onPress={() => toggleSubscription(item.id)}
      />
    ),
    [expandedSubscriptionId, toggleSubscription]
  );

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery) return subscriptions;
    
    const lowerQuery = searchQuery.toLowerCase();
    return subscriptions.filter((sub) => 
      sub.name.toLowerCase().includes(lowerQuery) || 
      sub.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        <Text className="text-3xl font-sans-bold text-primary mt-6 mb-6">Subscriptions</Text>
        
        {/* Search Bar */}
        <TextInput 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search subscriptions or categories..."
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          className="bg-card border border-border rounded-2xl py-4 px-5 text-base font-sans-medium text-primary mb-6"
        />

        {/* Subscription List */}
        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscription}
          keyExtractor={(item) => item.id}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-base font-sans-medium text-muted-foreground text-center">
                No subscriptions match your search.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;