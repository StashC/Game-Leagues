import { onAuthStateChanged } from "firebase/auth";
import React, {useEffect, useState } from "react";
import { auth } from './firebase-config.js';

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currUser, setCurrUser] = useState(null);
  
    // useEffect(() => {
    //     console.log("this is called")
    //   auth.onAuthStateChanged(setCurrUser);
    // }, [auth]);
    onAuthStateChanged(auth, (currentUser) => {
        setCurrUser(currentUser)
    })

  return (
    <AuthContext.Provider value={ {currUser }} >
    {children}
    </AuthContext.Provider>
  );
}