import {Link, useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useRef} from "react";
import AuthContext from "../utils/AuthProvider";


export default function DetailsBox({display, func, apiUrl}) {

    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";


    function validateEmail(email) {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    //check if the password is strong
    function isPasswordStrong(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasNumber = /[0-9]/;
        let myArray = []
        myArray.push(password.length > minLength);
        myArray.push(hasUppercase.test(password));
        myArray.push(hasLowercase.test(password));
        myArray.push(hasNumber.test(password));
        return myArray;
    }


    const handleRegister = async (event) => {
        event.preventDefault();
        let checker = isPasswordStrong(password);
        if (!validateEmail(email)) {
            setErrMsg("Invalid email");
        } else if (!checker.every(element => element === true)) {
            if (!checker[0]) {
                setErrMsg("Password needs to have at least 8 characters");
            } else if (!checker[1]) {
                setErrMsg("Password needs to have at least 1 uppercase letter");
            } else if (!checker[2]) {
                setErrMsg("Password needs to have at least 1 lowercase letter");
            } else if (!checker[3]) {
                setErrMsg("Password needs to have at least 1 number");
            }
        } else {
            try {
                await axios.post(apiUrl + "/user/register", {userName, email, password},
                    {
                        headers: {'Content-Type': 'application/json'},
                    }
                );
                navigate("/login");
            } catch (err) {
                if (!err?.response) {
                    console.log("No Server Response");
                } else if (err.response?.status === 400) { //missing user details
                    setErrMsg(err.response.data);
                    console.log("Error Message:", err.response.data);
                } else if (err.response?.status === 409) { //user already exists
                    console.log("Error Message", err.response.data);
                    setErrMsg(err.response.data);
                } else {
                    setErrMsg("Registration failed");
                    console.log("Registration failed");
                }
            }
        }
    }


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            //axios makes data as json, no need to stringify it
            const response = await axios.post(apiUrl + "/user/authenticate", {email, password},
                {
                    headers: {'Content-Type': 'application/json'},
                }
            );
            //throws an error, if the response is not 200
            console.log("User logged in", JSON.stringify(response.data));
            const accessToken = response.data?.token;
            setAuth({userName, email, password, accessToken});
            localStorage.setItem("accessToken", accessToken);
            setPassword("");
            setUserName("");
            setEmail("");
            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                console.log("No Server Response");
            } else if (err.response?.status === 403) { //missing user details
                setErrMsg("User does not exist");
                console.log("User does not exist");
            } else {
                setErrMsg("Login failed");
                console.log("Login failed");
            }
        }
    }


    useEffect(() => {
        setErrMsg('');
    }, [userName, email, password])


    return (
        <div className="login-container">
            <form onSubmit={display ? handleLogin : handleRegister} className="login-form">
                <h1>{func}</h1>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="input-group">
                    <label htmlFor="email" style={{fontSize: "25px"}}>Email</label>
                    <input type="text" id="email" name="email" value={email} ref={userRef}
                           onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                {!display && (
                    <div className="input-group">
                        <label htmlFor="userName" style={{fontSize: "25px"}}>User name</label>
                        <input type="text" id="userName" name="userName" value={userName}
                               onChange={(e) => setUserName(e.target.value)} required/>
                    </div>
                )}
                <div className="input-group">
                    <label htmlFor="password" style={{fontSize: "25px"}}>Password</label>
                    <input type="password" id="password" name="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">{func}</button>
                {display && (
                    <div className="register-link">
                        <p>Don't have an account?</p>
                        <Link to="register">Register Now</Link>
                    </div>
                )
                }
            </form>
        </div>
    );


}