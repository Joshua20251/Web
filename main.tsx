import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocFromServer, doc } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

export const provider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function signIn() {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error('Auth Error: ', error);
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by the browser. Please allow popups for this site.');
    } else if (error.code === 'auth/internal-error') {
      throw new Error('An internal error occurred during sign-in. This might be due to browser restrictions or iframe constraints. Try opening the app in a new tab.');
    } else if (error.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-domain.com';
      throw new Error(`This domain is not authorized in Firebase. Please add "${currentHost}" to "Authorized Domains" in your Firebase Console (Authentication > Settings).`);
    }
    throw error;
  }
}

export async function submitFeedback(content: string, atmosphere: string, issue: string) {
  const path = 'feedbacks';
  try {
    return await addDoc(collection(db, path), {
      content,
      atmosphere,
      issue,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToFeedbacks(callback: (feedbacks: any[]) => void) {
  const path = 'feedbacks';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function submitSurvey(surveyData: {
  gender: string;
  grade: string;
  playFrequency: string;
  timeSlots: string[];
  neutralRating: number;
  barriers: string[];
  additionalFeedback: string;
}) {
  const path = 'surveys';
  try {
    return await addDoc(collection(db, path), {
      ...surveyData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToSurveys(callback: (surveys: any[]) => void) {
  const path = 'surveys';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

// Validation helper as per skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
