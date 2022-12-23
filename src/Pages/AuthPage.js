import '../App.css'
import  {createContext, useContext, useState} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import {auth} from '../firebase-config'
import { useEffect } from 'react'
import { leagueContext } from '../App'
import { AuthContext } from '../Auth'
import { useNavigate, redirect } from 'react-router-dom'

export const logout = async () => {
    await auth.signOut()
}

function AuthPage(){
    const navigate = useNavigate();

    const { setCurrLeagueID } = useContext(leagueContext) 

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    
    const {currUser} = useContext(AuthContext)

    const register = async () => {
        try {
            const newUser = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            console.log(newUser)
        } catch (error) {
            console.log(error.message + " | " + registerEmail + " | " + registerPassword);
        }
    }

    
    const login = async () => {
        try{
            const curUser = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            console.log(curUser)
        } catch (error) {
            console.log(error.message + " | " + userEmail + " | " + userPassword);
        }
    }


    useEffect( () => {
        if(currUser != null)
            if(currUser.email != "" || currUser.email != null){
                console.log(currUser.email)
                navigate("/")
            }
    }, [currUser])
    
    return(
        <div className="Loginpage">
            <div className="Register">
                <h3>Register</h3>
                <input placeholder="Enter Email"
                    onChange={(event) => { setRegisterEmail(event.target.value) }} />

                <input placeholder="Enter Password" 
                    onChange={ (event) => { setRegisterPassword(event.target.value)}}/>

                <button onClick={register}>Register Account</button>
            </div>

            <div className="Login">
                <h3> Sign In </h3>
                <input placeholder="Email"
                    onChange={(event) => {setUserEmail(event.target.value)}} />     

                <input placeholder="Password"
                    onChange={(event) => {setUserPassword(event.target.value)}}/>

                <button onClick={login}> Sign In</button>                
            </div>
            <h3> Current User: </h3>
            <h3>{currUser?.email}</h3>
            <button onClick={logout}> Sign Out </button>
        </div>
    );
}

export default AuthPage;