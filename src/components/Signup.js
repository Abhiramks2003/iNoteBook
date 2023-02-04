import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';
const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate();
  const host = "http://localhost:5000"

  //Submitting the user credentials
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials
    let url = `${host}/api/auth/createUser`
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json()
    console.log(json)
    if (json.success) {
      //Save the authtoken and redirect
      localStorage.setItem('token', json.authToken)
      navigate('/')
      props.showAlert("Account created successfully", "success")
    }
    else {
      props.showAlert("Invalid Credentials", "danger")
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className="container mt-3">
      <h2>Create an Account to use iNoteBook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" id="password" required minLength={5} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" name="cpassword" id="cpassword" required minLength={5} onChange={onChange} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <div className="mt-3">
        <h5>Already a User? <Link className='text-primary' to="/login">Login</Link></h5>
      </div>
    </div>
  )
}

export default Signup