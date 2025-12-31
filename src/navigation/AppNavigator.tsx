import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { Loading } from '../components/ui';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AddReminderScreen from '../screens/reminders/AddReminderScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useTheme();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="AddReminder"
              component={AddReminderScreen}
              options={{
                headerShown: true,
                title: 'Nuevo Recordatorio',
                presentation: 'modal',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
