import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { MainTabParamList } from '../types';
import { colors } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Importar navegadores de cada tab
import TodayScreen from '../screens/dashboard/TodayScreen';
import PetsNavigator from './PetsNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.textSecondary + '20',
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Hoy',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsNavigator}
        options={{
          tabBarLabel: 'Mis Mascotas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Cuenta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
