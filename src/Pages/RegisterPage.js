import './AuthPage.css'
import { useContext, useState} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import {auth} from '../firebase-config'
import { useEffect } from 'react'
import { leagueContext } from '../App'
import { AuthContext } from '../Auth'
import { useNavigate, redirect, Navigate } from 'react-router-dom'
import { register } from '../Auth'

function RegisterPage(){

    const { currUser } = useContext(AuthContext)
    const navigate = useNavigate();    

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const handleRegister = async () => {
        await register(registerEmail, registerPassword)
    }

    useEffect( () => {
        if(currUser != null)
            if(currUser.email != "" || currUser.email != null){
                navigate("/")
            }
    }, [currUser])

return(
    <div className="AuthPage">
        <h1>Game Leagues</h1>
        <div id="register-container" className="form-card">
            <h2>Register</h2>
            <h4>Enter Email</h4>
            <input placeholder=""
                onChange={(event) => { setRegisterEmail(event.target.value) }} />
            <h4>Enter Password</h4>
            <input placeholder="" 
                onChange={ (event) => { setRegisterPassword(event.target.value)}}/>

            <button className='large-button'
                onClick={handleRegister}>Register Account</button>

            <p>Have an account?     
                <button className='link'
                onClick={() => {
                    console.log("clicked go to login")
                    navigate("/login")
                }}> Login.</button>
            </p>
        </div>
    </div>
    )
}
 export default RegisterPage;