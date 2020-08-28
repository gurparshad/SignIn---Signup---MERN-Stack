import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export default function AuthOptions() {
    const { userData, setUserData } = useContext(UserContext);

    const history = useHistory();

    const registerMethod = () => history.push("/register");
    const loginMethod = () => history.push("/login");
    const logOutMethod = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
    };

    return (
        <div className="authOptions">
            {userData.user ? (
                <button onClick={logOutMethod}>Log Out</button>
            ) : (
                <>
                <button onClick={registerMethod}>Register</button>
                <button onClick={loginMethod}>Login</button>
            </>
            )}

        
        </div>
    );
}
