import React, { useContext } from 'react'
import assets from '../assets/assets.js'

import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';


const Navbar = () => {

    
   
    const {userData, backendUrl, setUserData, setIsLoggedIn, navigate} = useContext(AppContent);

    const sendVerificationOtp = async ()=>{
        try{
            axios.defaults.withCredentials = true;
            const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp');
            if(data.success){
                navigate('/email-verify');
                toast.success(data.message);
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message);

        }
    }

    const logout = async()=>{
        try{
            axios.defaults.withCredentials = true;
            const {data} = await axios.post(backendUrl+'/api/auth/logout')
            data.success && setIsLoggedIn(false)
            data.success && setUserData(false)
            navigate('/')
        }catch(error){
            toast.error(error.message)

        }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        {/* <div className='flex gap-5'>
            <img 
            onClick={()=>navigate('/')}
            src={assets.f_logo} alt="" className='h-10  sm:w-12 absolute top-9'/>
            <h1 className='text-3xl font-bold items-start gap-0 text-blue-950 absolute top-10 left-35'>auth</h1>

        </div> */}
         <div onClick={()=>navigate('/')}  className='flex cursor-pointer'>
                <img src={assets.fastAuth} alt=""
              className='absolute left-5 w-40  sm:left-20 top-5 sm:w-45 cursor-pointer' 
              />
           
        </div>
      

    {userData ?
    <div
    className='w-12 h-12 border-2 border-white flex justify-center items-center rounded-full bg-black text-white relative group text-xl'
    >
        {userData.name[0].toUpperCase()}
        <div
        className='absolute hidden group-hover:block top-3 right-0 z-10 text-black rounded pt-10'

        >
            <ul
            className='list-none rounded-2xl m-0 p-2 bg-gradient-to-r from-indigo-700 to-black text-white text-sm'
            >
                {!userData.isAccountVerified && 
                <li onClick={sendVerificationOtp} 
                className='py-1 px-2 hover:bg-gray-400 rounded-xl cursor-pointer'
                >Verify email</li>}
                
                <li onClick={logout} className='py-1 px-2 rounded-xl hover:bg-gray-400 cursor-pointer pr-10'>Logout</li>
            </ul>
           
        </div>
       
    </div>
    :
    <button onClick={()=>navigate('/login')}
    className='flex item-center gap-2 border-2 border-white text-white font-bold bg-gradient-to-r from-indigo-950 to-black rounded-full px-6 py-2 hover:bg-gray-100 transition-all cursor-pointer'>
    Login</button>

}   

      
    </div>
  )
}

export default Navbar
