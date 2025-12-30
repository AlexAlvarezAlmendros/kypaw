import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Pet } from '../types';

// Colección de mascotas para un usuario
const getPetsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'pets');
};

// Obtener todas las mascotas de un usuario
export const getUserPets = async (userId: string): Promise<Pet[]> => {
  console.log('📡 getUserPets: Consultando Firestore para userId:', userId);
  const petsCol = getPetsCollection(userId);
  const q = query(petsCol, orderBy('createdAt', 'desc'));
  
  const startTime = Date.now();
  const snapshot = await getDocs(q);
  const endTime = Date.now();
  
  console.log(`📡 getUserPets: Firestore respondió en ${endTime - startTime}ms con ${snapshot.docs.length} documentos`);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Pet[];
};

// Obtener una mascota por ID
export const getPet = async (userId: string, petId: string): Promise<Pet | null> => {
  const petDoc = doc(db, 'users', userId, 'pets', petId);
  const snapshot = await getDoc(petDoc);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Pet;
};

// Crear una nueva mascota
export const createPet = async (userId: string, petData: Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const petsCol = getPetsCollection(userId);
  const now = Timestamp.now();
  
  const docRef = await addDoc(petsCol, {
    ...petData,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
};

// Actualizar una mascota
export const updatePet = async (userId: string, petId: string, updates: Partial<Pet>): Promise<void> => {
  const petDoc = doc(db, 'users', userId, 'pets', petId);
  await updateDoc(petDoc, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Eliminar una mascota
export const deletePet = async (userId: string, petId: string): Promise<void> => {
  const petDoc = doc(db, 'users', userId, 'pets', petId);
  await deleteDoc(petDoc);
};
