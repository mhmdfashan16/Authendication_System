import React, { useContext, useState } from 'react'
import assets from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {

    const navigate = useNavigate();

    const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContent);

    const [state, setState] = useState('Login');
    const[name, setName]= useState('');
    const[email, seEmail]= useState('');
    const [password, setPassword]=useState('');

   const onSubmitHandler= async (e)=>{
    try{
        e.preventDefault();
        axios.defaults.withCredentials = true;
        

        if(state === 'Sign Up'){
            const {data} =  await axios.post(backendUrl + '/api/auth/register',{name, email, password})

            if(data.success){
                setIsLoggedIn(true);
                getUserData();
                navigate('/')
            }else{
                toast.error(data.message);
            }

        }else{
            const {data} =  await axios.post(backendUrl + '/api/auth/login',{email, password})

            if(data.success){
                setIsLoggedIn(true)
                getUserData();
                navigate('/')
            }else{
                toast.error(data.message);
            }

        }

    }catch(error){
        toast.error(error.message);

    }

   }

  return (
    <div
    className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-indigo-950'
    >
        <div onClick={()=>navigate('/')} className='flex cursor-pointer'>
        <img  src={assets.f_logo} alt=""
      className='absolute left-5 w-8 h-15 sm:left-20 top-5 w-13 sm:w-15 cursor-pointer' 
      />
      <h1 className='flex absolute top-7 left-33 text-4xl font-bold text-indigo-900'>-auth</h1>
        </div>
      
      <div
        className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'
      >
        <h2
        className='text-3xl font-semibold text-white text-center mb-3'
        >{state === 'Sign Up'?'Create Account':'Login'}</h2>
        <p
        className='text-center text-sm mb-6 '
        >{state === 'Sign Up'?'Create Your Account':'Login Your Account'}</p>


        <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (<div 
            className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
            >
                <img src={assets.person_icon} alt="" />
                <input
                onChange={e=> setName(event.target.value)}
                value={name}
                className='bg-transparent outline-none w-full'
                type="text" placeholder='Full Name' required />
            </div>)}
           

            <div 
            className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
            >
                <img src={assets.mail_icon} alt="" />
                <input
                onChange={e=>seEmail(event.target.value)}
                value={email}
                className='bg-transparent outline-none w-full'
                type="email" placeholder='Email here' required />
            </div>

            <div 
            className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'
            >
                <img src={assets.lock_icon} alt="" />
                <input
                onChange={e=> setPassword(event.target.value)}
                value={password}
                className='bg-transparent outline-none w-full'
                type="password" placeholder='Password' required />
            </div>

            <p
            className='mb-5 text-indigo-500 cursor-pointer '
            onClick={()=>navigate('/reset-password')}
            >Forgot Password</p>
            <button onClick={onSubmitHandler}
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
            >{state}</button>
        </form>
        

        {state === 'Sign Up'? (<p
        className='text-gray-400 text-center text-s mt-4'
        >Already have an account?{' '}
            <span
            className='text-blue-400 cursor-pointer underline'
           onClick={()=>setState('Login')}
           >Login here</span>
        </p>) : (<p
        className='text-gray-400 text-center text-s mt-4'
        >Don't have an account?{' '}
            <span
            className='text-blue-400 cursor-pointer underline'
            onClick={()=>setState('Sign Up')}
           >Signup</span>
        </p>)}

      </div>
    </div>
  )
}

export default Login
