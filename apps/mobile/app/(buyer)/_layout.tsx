import React from 'react';
import { Tabs } from 'expo-router';
import { AuthGate } from '@/core/router';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerLayout() {
  return (
    <AuthGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#15803d',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Giỏ hàng',
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Đơn hàng',
            tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </AuthGate>
  );
}
