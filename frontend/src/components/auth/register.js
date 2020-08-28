import React, {useState, useContext} from 'react'
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/errorNotice';

export default function Register() {
    const [name, setName ] = useState();
    const [email, setEmail ] = useState();
    const [password, setPassword ] = useState();
    const [confirmPassword, setConfirmPassword ] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submitMethod = async (e) => {
        e.preventDefault();
        try{
            const newUser = { name, email, password, confirmPassword};
            const registerRes = await Axios.post(
              "http://localhost:5000/users/register",
                newUser
            );
            const loginRes = await Axios.post("http://localhost:5000/users/login", {
                email,
                password
            });
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
        <div className="registerPage">
            <form onSubmit={submitMethod} className="registerForm">
            <h2>Register Here</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} /> }
                <label>Name</label>
                <input type="text" name="name" onChange={(e) => setName(e.target.value)}></input>
                <br/>
                <label>Email</label>
                <input type="email" name="email"  onChange={(e) => setEmail(e.target.value)}></input>
                <br/>
                <label>Password</label>
                <input type="password" name="password"  onChange={(e) => setPassword(e.target.value)}></input>
                <br/>
                <label>Confirm password</label>
                <input type="password"  onChange={(e) => setConfirmPassword(e.target.value)}></input>
                <br/>
                <button type="submit" className="signUpButton">Submit</button>
                </form>
        </div>
    )
}
