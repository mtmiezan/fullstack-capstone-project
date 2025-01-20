import React, { useState, useEffect } from 'react'
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    // User already logged in
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);


    const handleLogin = async () => {
        try {
            //Step 1: Implement API call
            const url = `${urlConfig.backendUrl}/api/auth/login`;
            const reponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',// Include Bearer token if available
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            })
            //Step 2: Access data and set user details
            const json = await reponse.json();
            const { authtoken, userName, userEmail } = json;
            if (authtoken) {
                //Set user details in session storage
                sessionStorage.setItem('auth-token', authtoken);
                sessionStorage.setItem('name', userName);
                sessionStorage.setItem('email', userEmail);
                //Set the state of the user to logged in  on app context
                setIsLoggedIn(true);
                //Navigate to main page
                navigate('/app');
            }
            else {
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setIncorrect('Wrong password. Try again.');
                // Clear incorrect message after 2 secondes
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }
        }
        catch {

        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value);setIncorrect("")}}
                            />
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        </div>
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;