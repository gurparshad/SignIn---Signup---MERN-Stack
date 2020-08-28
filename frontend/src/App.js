import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"; 
import Axios from 'axios';

import Home from './components/pages/home';
import Register from './components/auth/register';
import Login from './components/auth/login';
import Header from './components/layout/header';
import UserContext from './context/UserContext';

import './style.css';

   {/* exact is a boolean which is true by default used to check the exact path.             example - we have this route - localhost:3000/login. -----> given url.
     now react router will do partial matching (if we are not using the exact) of the given url with all the routes declared in the app.
            so it comapre with first "/" it partialy matches with the given url but we are using exact so that wont be trigered.("/" this whole thing was present in given url.)
            then it comes to second - "/register" but this does not match ("/register" this whole thing was not present in given url. but if we had "localhost:3000/register/user" 
            as a given url then this second route will be activated. if exact was not used )
            then it comes to third route so it matches "/login" this whole thing is present in teh given url.
            
            */}

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    // we cant use the async function directly in a useEffect hook,
    // so we created an async function and then called it.
    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token"); 
            // token can be null if there is no token empty string or if there is no key auth-token present in the local storage. 
            if(token === null){  
                localStorage.setItem("auth-token", ""); // set the key-value pair in local storage.
                token = ""; // this token variable is passed in the next code snippet.
            }
            const tokenRes  = await Axios.post(
                "http://localhost:5000/users/tokenIsValid",
                null,
                { headers: { "x-auth-token": token }}
            );
            if(tokenRes.data){
                const userRes = await Axios.get(
                    "http://localhost:5000/users/",
                    {headers: {"x-auth-token": token }}
                    );
                setUserData({
                    token,
                    user: userRes.data,
                })
            }
            
        }
        checkLoggedIn();
    }, []);

    // context provide a state which can be used to in other components, by using a hook - useContext.  

    return (

        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home} /> 
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
            </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    )
}
