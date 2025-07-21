// Serviços de autenticação do Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Tipos
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  userType: 'user' | 'artist' | 'admin';
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified?: boolean;
  followersCount?: number;
}

// Provedor do Google
const googleProvider = new GoogleAuthProvider();

// Registrar usuário
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  userType: 'user' | 'artist' | 'admin' = 'user'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar perfil
    await updateProfile(user, { displayName });

    // Criar documento do usuário no Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      userType,
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: userType === 'artist' ? false : undefined,
      followersCount: userType === 'artist' ? 0 : undefined,
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return user;
  } catch (error) {
    throw error;
  }
};

// Login de usuário
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Atualizar último login
    await setDoc(
      doc(db, 'users', userCredential.user.uid),
      { lastLogin: new Date() },
      { merge: true }
    );

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login com Google
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar se é um novo usuário
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Criar documento para novo usuário
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Usuário',
        userType: 'user',
        profileImage: user.photoURL || undefined,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    } else {
      // Atualizar último login
      await setDoc(
        doc(db, 'users', user.uid),
        { lastLogin: new Date() },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Observar mudanças na autenticação
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do usuário
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};
