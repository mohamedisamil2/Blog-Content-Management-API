import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <div>
          <Link to="/" className='flex items-center gap-2'>
             <p className='bg-rose-500 text-white text-xs md:text-2xl w-2 h-2 rounded-full p-2'>D</p>
              <h1 className='text-rose-500 text-xs md:text-2xl font-semibold'>Daily Blog</h1> 
          </Link>
    </div>
  )
}

export default Logo
