import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      const api=await axios.post(`http://localhost:5000/api/users/register`,{
        name,
        email,
        password
      },{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      });
       alert("Registration successful!");
    }catch(error){
      console.log(error)
       alert("Registration failed!");
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen'>
       <div className='w-full max-w-sm bg-amber-200 shadow-lg rounded-lg p-8 '>
        <h1 className="text-2xl font-bold mb-4 text-center text-yellow-900">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className='relative mb-4'>
              <label htmlFor='name' className='block mb-1 text-sm font-medium text-gray-700'>Full Name</label>
              <input id='name'
              type='text' 
              placeholder='Enter your name'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400'
              value={name} onChange={(e)=>setName(e.target.value)}/><br/><br/>
            </div>
            <div className='relative mb-4'>
              <label htmlFor='email' className='block mb-1 text-sm font-medium text-yellow-900'>Email</label>
              <input id='email'
                type='email' 
                placeholder='Enter your email'
                className='w-full px-4 py-2 border border-yellow-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400'
                value={email} onChange={(e)=>setEmail(e.target.value)} /><br /><br />
            </div>
            <div className='relative mb-4'>
              <label htmlFor='password' className='block mb-1 text-sm font-medium text-yellow-900'>Password</label>
              <input id='password'
              type='password' 
              placeholder='Enter your password' 
              className='w-full px-4 py-2 border border-yellow-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400'
              value={password} onChange={(e)=>setPassword(e.target.value)}/><br /><br />
            </div>
          <button className='bg-amber-600 hover:bg-amber-700 text-white border p-2 rounded-xl' type='submit'>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register