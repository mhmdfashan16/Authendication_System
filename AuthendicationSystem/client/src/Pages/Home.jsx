import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'
//bg-[url("/bg_img.png")]

const Home = () => {
  return (
    <div className='flex flex-col items-center bg-gradient-to-b from-black-500 to-gray-700 bg-[url("/bg_img.png")] justify-center  min-h-screen  bg-cover bg-center'>
     <Navbar/>
     <Header/>
    </div>
  )
}

export default Home
