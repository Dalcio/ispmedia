import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User,
  AuthError
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: any;
  updatedAt: any;
  profilePicture?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Auth functions
export async function signUp(
  email: string, 
  password: string, 
  name: string
): Promise<AuthResult> {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    const userProfile: Omit<UserProfile, 'uid'> = {
      email: user.email!,
      name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { success: true, user };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
}

export async function signIn(
  email: string, 
  password: string
): Promise<AuthResult> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { uid, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  uid: string, 
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Helper function to convert Firebase auth error codes to user-friendly messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique seu email.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso. Tente fazer login.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'Email inválido. Verifique o formato.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}
