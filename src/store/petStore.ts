import { create } from 'zustand';
import { Pet } from '../types';

interface PetState {
  pets: Pet[];
  activePet: Pet | null;
  setPets: (pets: Pet[]) => void;
  setActivePet: (pet: Pet | null) => void;
  addPet: (pet: Pet) => void;
  updatePet: (petId: string, updates: Partial<Pet>) => void;
  removePet: (petId: string) => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  activePet: null,
  setPets: (pets) => set({ pets }),
  setActivePet: (activePet) => set({ activePet }),
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (petId, updates) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === petId ? { ...pet, ...updates } : pet
      ),
      activePet:
        state.activePet?.id === petId
          ? { ...state.activePet, ...updates }
          : state.activePet,
    })),
  removePet: (petId) =>
    set((state) => ({
      pets: state.pets.filter((pet) => pet.id !== petId),
      activePet: state.activePet?.id === petId ? null : state.activePet,
    })),
}));
