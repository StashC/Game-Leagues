import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth'

import ENV from './env.js'

const firebaseConfig = {
    apiKey: ENV.apiKey,
    authDomain: ENV.authDomain,
    projectId: ENV.projectId,
    storageBucket: ENV.storageBucket,
    messagingSenderId: ENV.messagingSenderId,
    appId: ENV.appId,
    measurementId: ENV.measurementId
  };

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);

  export const auth = getAuth(app)

  