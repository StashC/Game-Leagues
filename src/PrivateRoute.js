import React, { useContext } from "react";
import { redirect, Navigate } from 'react-router-dom';
import { AuthContext } from "./Auth";

// const PrivateRoute = ({ component: RouteComponent, ...rest}) => {
//     const {currUser} = useContext(AuthContext)
//     return (
//         <Route 
//             {...rest}
//             render={routeProps => 
//             !!currUser ? (
//                 <RouteComponent {...routeProps} />
//             ) : (
//                 redirect("/login")
//             )
//             }
//         />
//     )
// } 
const PrivateRoute = ({ children }) => {
    const {currUser} = useContext(AuthContext)

    
    return currUser ? children : <Navigate to="/Game-Leagues/login" />;
  }
export default PrivateRoute