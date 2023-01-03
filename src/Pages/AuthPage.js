import '../App.css'
import { useContext, useState} from 'react'
import { useEffect } from 'react'
import { AuthContext } from '../Auth'
import { useNavigate, redirect } from 'react-router-dom'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { render } from '@testing-library/react'

function AuthPage(){
    
    const {currUser, setCurrUser } = useContext(AuthContext)
    
    var currPage = null;
    const loginPage = LoginPage();
    const registerPage = RegisterPage();

    return(
        <div className="AuthPage">
            <h1>Game Leagues</h1>
            {currPage}
            {/* {!showRegister && loginPage}
            {showRegister && registerPage}             */}
        </div>   
    );
}

export default AuthPage;