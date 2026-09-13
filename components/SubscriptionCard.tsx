import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils'
import React from 'react'
import { Image, Pressable, Text, View, type PressableProps } from 'react-native'

const SubscriptionCard = ({ name, price, status, startDate, currency, icon, billing, color, paymentMethod, category, plan, renewalDate, expanded, onPress }: SubscriptionCardProps & { expanded?: boolean } & Pick<PressableProps, 'onPress'>) => {
    const subscriptionMeta =
        category?.trim() ||
        plan?.trim() ||
        (renewalDate ? formatSubscriptionDateTime(renewalDate) : "No plan")

    return (
        <Pressable onPress={onPress} className={`sub-card ${expanded ? "sub-card-expanded" : "bg-card"}`} style={!expanded && color ? { backgroundColor: color } : undefined} >
            <View className="sub-head">
                <View className="sub-main">
                    <Image source={icon} className="sub-icon" />

                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">
                            {name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                            {subscriptionMeta}
                        </Text>
                    </View>
                </View>

                <View className="sub-price-box">
                    <Text className="sub-price">
                        {formatCurrency(price, currency)}
                    </Text>
                    <Text className="sub-billing">
                        {billing}
                    </Text>
                </View>

            </View>

            {expanded && (
                <View className="sub-body">
                    <View className="sub-details">
                        <View className="sub-row">
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Payment:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode="tail">
                                    {paymentMethod?.trim() || "No payment method"}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Category:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode="tail">
                                    {category?.trim() || plan?.trim() || "No category"}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Started:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode="tail">
                                    {startDate ? formatSubscriptionDateTime(startDate) : "No start date"}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Renewal Date:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode="tail">
                                    {renewalDate ? formatSubscriptionDateTime(renewalDate) : "No renewal date"}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Status:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode="tail">
                                    {status ? formatSubscriptionDateTime(status) : ""}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

        </Pressable>
    )
}

export default SubscriptionCard
