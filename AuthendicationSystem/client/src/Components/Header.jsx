import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AppContent } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const {userData, navigate} = useContext(AppContent);

  return (
    // <div className='flex flex-col items-start px-5 py-5 rounded-4xl border-gray-500 border-2  bg-gradient-to-l from-blue-300 via-blue-500 to-blue-300 '>
    
    <div className='flex flex-col items-center mt-50  px-4 text-center'>
    
    <img src={assets.user_logo} alt="" 
    className='w-36 h-36 rounded-full mb-6'/>
    <h1 className='flex item-center gap-2 text-xl text-white sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developers'}! <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>

  <h2
      className='text-3xl sm:text-5xl font-semibold mb-4 text-white'
  >Welcome to our app</h2>
  <p
  className='text-lg font-semi-bold mb-8 max-w-xl text-white'
  >Your Secure Digital Gateway
  We're glad to have you here! 
  Sign in to access your personalized dashboard, manage your profile, and enjoy a seamless, secure experience.
  <br/>New to fastAuth? Create an account and become part of a trusted community today.
  </p>
  <button onClick={()=>navigate('/login')}  className='border-2 rounded-full px-8 py-2.5 hover:bg-gradient-to-l from-black  via-indigo-950 to-black hover:text-white transition-all cursor-pointer bg-black border-amber-50 text-white'>Get Started</button>
  </div>
// </div>
   
  )
}

export default Header
