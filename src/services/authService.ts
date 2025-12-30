import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Registrar nuevo usuario
export const registerUser = async (email: string, password: string, displayName?: string): Promise<FirebaseUser> => {
  console.log('📝 Intentando registrar usuario:', email);
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  console.log('✅ Usuario creado en Firebase Auth:', user.uid);
  
  // Actualizar perfil con nombre
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  
  // Crear documento de usuario en Firestore
  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, {
    email: user.email,
    displayName: displayName || null,
    createdAt: Timestamp.now(),
  });
  
  console.log('✅ Documento de usuario creado en Firestore');
  
  return user;
};

// Iniciar sesión
export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Cerrar sesión
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
