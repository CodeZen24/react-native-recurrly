import { useUser } from "@clerk/expo";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";


import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView);

const listContentContainerStyle = { paddingBottom: 100 };

const keyExtractor = ({ id }: { id: string }) => id;

const SubscriptionSeparator = () => <View className="h-4" />;

const renderUpcomingSubscription = ({
  item,
}: ListRenderItemInfo<UpcomingSubscription>) => (
  <UpcomingSubscriptionCard data={item} />
);

const HomeListHeader = () => {
  const { user } = useUser();

  return (
    <>
      <View className="home-header">
        <View className="home-user">
          <Image source={{ uri: user?.imageUrl }} className="home-avatar" />
          <Text className="home-user-name">{user?.fullName || "Welcome"}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MMM D, YYYY")}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={renderUpcomingSubscription}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">No upcoming renewals yet</Text>
          }
        />
      </View>

      <ListHeading title="All Subscriptions" />
    </>
  );
};

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const toggleSubscription = useCallback((id: string) => {
    setExpandedSubscriptionId((currentId) =>
      currentId === id ? null : id,
    );
  }, []);

  const renderSubscription = useCallback(
    ({ item }: ListRenderItemInfo<Subscription>) => (
      <SubscriptionCard
        {...item}
        expanded={expandedSubscriptionId === item.id}
        onPress={() => toggleSubscription(item.id)}
      />
    ),
    [expandedSubscriptionId, toggleSubscription],
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={HOME_SUBSCRIPTIONS}
        renderItem={renderSubscription}
        keyExtractor={keyExtractor}
        extraData={expandedSubscriptionId}
        ListHeaderComponent={HomeListHeader}
        ItemSeparatorComponent={SubscriptionSeparator}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet</Text>
        }
        contentContainerStyle={listContentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
