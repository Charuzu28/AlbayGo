import React from 'react';
import Logo from '../components/Logo';
import SearchInput from '../components/SearchInput';

const Home = () => {
  return (
    <main className='min-h-screen flex justify-center px-4 items-center'>
        <div className='w-full max-w-full text-center space-y-6'>
            <Logo />
            <p className='
            text-gray-600 
              text-sm
              sm:text-lg
              font-poppins
              '>Your local guide for moving around Albay.</p>

            <SearchInput />
        </div>
    </main>
  )
}

export default Home