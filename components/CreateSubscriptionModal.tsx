import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import { icons } from '@/constants/icons';

const CATEGORIES = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': '#ff9999',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#b8e8d0',
  'Cloud': '#a3c4f3',
  'Music': '#f1c0e8',
  'Other': '#d3d3d3',
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: any) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('Other');

  const isValid = name.trim().length > 0 && parseFloat(price) > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(1, frequency === 'Monthly' ? 'month' : 'year')
      .toISOString();

    const newSubscription = {
      id: `sub_${Date.now()}`,
      icon: icons.wallet,
      name: name.trim(),
      plan: 'Custom Plan',
      category,
      paymentMethod: 'Custom',
      status: 'active',
      startDate,
      price: parseFloat(price),
      currency: 'USD',
      billing: frequency,
      renewalDate,
      color: CATEGORY_COLORS[category] || '#d3d3d3',
    };

    onSubmit(newSubscription);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Other');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetForm}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="modal-overlay justify-end">
          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable onPress={resetForm} className="modal-close">
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView className="modal-body" contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
              
              {/* Name Field */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  className="auth-input"
                />
              </View>

              {/* Price Field */}
              <View className="auth-field">
                <Text className="auth-label">Price ($)</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  keyboardType="decimal-pad"
                  className="auth-input"
                />
              </View>

              {/* Frequency Field */}
              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    onPress={() => setFrequency('Monthly')}
                    className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFrequency('Yearly')}
                    className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Category Field */}
              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx('category-chip', category === cat && 'category-chip-active')}
                    >
                      <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                className={clsx('auth-button mt-4', !isValid && 'auth-button-disabled')}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
