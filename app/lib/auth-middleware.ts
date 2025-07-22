import { NextRequest } from 'next/server';
import { adminAuth } from '@/firebase/admin';

export interface AuthResult {
  success: boolean;
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
  error?: string;
}

export async function verifyAuthToken(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return {
        success: false,
        error: 'Authorization header missing'
      };
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return {
        success: false,
        error: 'Access token missing'
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
      }
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      success: false,
      error: 'Invalid or expired token'
    };
  }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<AuthResult> {
  const authResult = await verifyAuthToken(request);
  
  if (!authResult.success) {
    return authResult;
  }

  try {
    const uid = authResult.user?.uid!;
    const { adminFirestore } = await import('@/firebase/admin');
    
    const userDoc = await adminFirestore.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const userData = userDoc.data();
    const userRole = userData?.userType || 'comum';

    if (!allowedRoles.includes(userRole)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    return authResult;
  } catch (error) {
    console.error('Role verification failed:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}
