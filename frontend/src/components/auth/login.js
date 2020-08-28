import React, {useState, useContext} from 'react'
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/errorNotice';

export default function Login() {
    const [email, setEmail ] = useState();
    const [password, setPassword ] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();


    const submitMethod = async (e) => {
        e.preventDefault();

        try{
            const loginUser = { email, password};
            const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            history.push('/');
        }catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }

    };

    return (
        <div className="loginPage">
        <form onSubmit={submitMethod} className="loginForm">
            <ul className="loginList">
            <li>
            <h2>Login Here</h2>
            </li>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} /> }
            <li className="loginListItem">
            <label>Email</label>
            <br/>
            <input type="email" name="email"  onChange={(e) => setEmail(e.target.value)}></input>
            </li>
            <li className="loginListItem">
            <label>Password</label>
            <br/>
            <input type="password" name="password"  onChange={(e) => setPassword(e.target.value)}></input>
            </li>
            <li className="loginListItem">
            <button type="submit" className="loginButton">Login</button>
            </li>
            </ul>
        </form>
        </div>
    )
}
