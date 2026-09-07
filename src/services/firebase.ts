import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA3ew4uFFoEadNsaosFpJRFl0WnX8YfX70',
  authDomain: 'pragmatic-nucleus-1ms1d.firebaseapp.com',
  projectId: 'pragmatic-nucleus-1ms1d',
  storageBucket: 'pragmatic-nucleus-1ms1d.firebasestorage.app',
  messagingSenderId: '196686664311',
  appId: '1:196686664311:web:e393163548deda3b0bac72',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
