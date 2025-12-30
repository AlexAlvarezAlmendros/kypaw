import { create } from 'zustand';
import { Pet } from '../types';
import { getUserPets, createPet, updatePet as updatePetService, deletePet } from '../services/petService';

interface PetState {
  pets: Pet[];
  activePet: Pet | null;
  loading: boolean;
  setPets: (pets: Pet[]) => void;
  setActivePet: (pet: Pet | null) => void;
  fetchPets: (userId: string) => Promise<void>;
  addPet: (userId: string, pet: Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExistingPet: (userId: string, petId: string, updates: Partial<Pet>) => Promise<void>;
  removePet: (userId: string, petId: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  activePet: null,
  loading: false,
  setPets: (pets) => set({ pets }),
  setActivePet: (activePet) => set({ activePet }),
  
  fetchPets: async (userId: string) => {
    console.log('🔄 Iniciando fetchPets para userId:', userId);
    set({ loading: true });
    try {
      const startTime = Date.now();
      const pets = await getUserPets(userId);
      const endTime = Date.now();
      console.log(`✅ fetchPets completado en ${endTime - startTime}ms. Total mascotas:`, pets.length);
      set({ pets, loading: false });
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  addPet: async (userId: string, petData) => {
    try {
      const petId = await createPet(userId, petData);
      const newPet: Pet = {
        id: petId,
        userId,
        ...petData,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      set((state) => ({ pets: [newPet, ...state.pets] }));
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  },
  
  updateExistingPet: async (userId: string, petId: string, updates: Partial<Pet>) => {
    try {
      await updatePetService(userId, petId, updates);
      set((state) => ({
        pets: state.pets.map((pet) =>
          pet.id === petId ? { ...pet, ...updates } : pet
        ),
        activePet:
          state.activePet?.id === petId
            ? { ...state.activePet, ...updates }
            : state.activePet,
      }));
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  },
  
  removePet: async (userId: string, petId: string) => {
    try {
      await deletePet(userId, petId);
      set((state) => ({
        pets: state.pets.filter((pet) => pet.id !== petId),
        activePet: state.activePet?.id === petId ? null : state.activePet,
      }));
    } catch (error) {
      console.error('Error removing pet:', error);
      throw error;
    }
  },
}));
