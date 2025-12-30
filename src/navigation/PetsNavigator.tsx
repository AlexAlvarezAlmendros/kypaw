import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetsStackParamList } from '../types';
import PetsListScreen from '../screens/pets/PetsListScreen';
import PetDetailScreen from '../screens/pets/PetDetailScreen';
import AddPetScreen from '../screens/pets/AddPetScreen';
import EditPetScreen from '../screens/pets/EditPetScreen';
import HealthHistoryScreen from '../screens/health/HealthHistoryScreen';
import AddVisitScreen from '../screens/health/AddVisitScreen';

const Stack = createNativeStackNavigator<PetsStackParamList>();

const PetsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="PetsList"
        component={PetsListScreen}
        options={{ title: 'Mis Mascotas' }}
      />
      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: 'Nueva Mascota' }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ title: 'Editar Mascota' }}
      />
      <Stack.Screen
        name="HealthHistory"
        component={HealthHistoryScreen}
        options={{ title: 'Historial de Salud' }}
      />
      <Stack.Screen
        name="AddVisit"
        component={AddVisitScreen}
        options={{ title: 'Nueva Visita' }}
      />
    </Stack.Navigator>
  );
};

export default PetsNavigator;
