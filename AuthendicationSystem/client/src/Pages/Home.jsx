import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'
//bg-[url("/bg_img.png")]

const Home = () => {
  return (
    <div className='flex flex-col items-center bg-black h-screen w-full text-black  min-h-screen  bg-cover bg-center'>
     <Navbar/>
     <Header/>
    </div>
  )
}

export default Home
