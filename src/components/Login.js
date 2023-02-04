import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();
    const host = "http://localhost:5000"

    //Submitting the user credentials
    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = `${host}/api/auth/login`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json)
        if (json.success) {
            //Save the authtoken and redirect
            localStorage.setItem('token',json.authToken)
            navigate('/')
            props.showAlert("Login Success!","success")
        }
        else {
            console.log("Login Failed!!!")
            props.showAlert("Invalid Credentials","danger")  
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='container mt-5'>
            <h2>Login to continue to iNoteBook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <div className="mt-3">
                    <h5>New User? <Link className='text-primary' to="/signup">Signup</Link> </h5>
                </div>
            </form>
        </div>
    )
}

export default Login