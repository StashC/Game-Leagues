import './AuthPage.css'
import { useContext, useState} from 'react'
import {auth} from '../firebase-config'
import { useEffect } from 'react'
import { leagueContext } from '../App'
import { AuthContext } from '../Auth'
import { useNavigate, redirect } from 'react-router-dom'
import { login } from '../Auth'


function LoginPage(){

    const navigate = useNavigate();    

    const { currUser} = useContext(AuthContext)    

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleLogin = async () => {
        await login(userEmail, userPassword)
    }


    useEffect( () => {
        if(currUser != null)
            if(currUser.email != "" || currUser.email != null){
                console.log(currUser.email)
                navigate("/")
            }
    }, [currUser])

    //Add event listener to login using "Enter" key.
    useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            event.preventDefault();
            handleLogin();
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, []);

return(
    <div className="AuthPage">
        <h1>Game Leagues</h1>
        <div id="login-container" className="form-card">
            <h2>Login </h2>
            <h4>Email </h4>
            <input type="text"
                onChange={(event) => {setUserEmail(event.target.value)}} />     
            <h4>Password</h4>
        
            <input id= "login-password-input" type="password"
                onChange={(event) => {setUserPassword(event.target.value)}}/>
            
            <p id="resetPass">Forgot password? 
                <button className='link'
                //onClick={}>
                >Reset Password.</button> </p>
            
            <button className="large-button" 
                onClick={handleLogin}> Sign In</button> 

            <p>Need an account? 
                <button className='link'
                onClick={() => {
                    console.log("pressed")
                    navigate("/register")
                }}> Register.</button> </p>
        </div>
    </div>
    )
}
export default LoginPage;