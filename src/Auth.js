import { onAuthStateChanged } from "firebase/auth";
import React, {useEffect, useState } from "react";
import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


export const AuthContext = React.createContext();

export const login = async (email, password) => {
  try{
      const curUser = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
      //console.log(error.message + " | " + email + " | " + password);
  }
}

export const logout = async () => {
  await auth.signOut()
}

export const register = async (email, password) => {
  try {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      //redirect to login by changing authpage state
  } catch (error) {
      //console.log(error.message + " | " + email + " | " + password);
  }
}

export const AuthProvider = ({children}) => {
    const [currUser, setCurrUser] = useState(null);

    onAuthStateChanged(auth, (currentUser) => {
        setCurrUser(currentUser)
    })

  return (
    <AuthContext.Provider value={ {currUser } } >
    {children}
    </AuthContext.Provider>
  );
}