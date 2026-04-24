import React from 'react'

export default function Banner() {
  return (
    <div className='relative max-w-screen-2xl mx-auto'>
      <div className='absolute w-full h-32 bg-gradient-to-t from-gray-100 via-transparent bottom-0 z-20' />
      
      <img 
        src="/amazon-banner.png" 
        loading='lazy' 
        alt="Amazon Banner" 
        className='w-full object-cover md:h-400px' 
      />
    </div>
  )
}
