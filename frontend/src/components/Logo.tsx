import { Link } from 'react-router-dom'

function Logo() {
  return (
    <div>
          <Link to="/" className='flex items-center gap-2'>
             <p className='bg-rose-500 text-white text-xs md:text-2xl w-2 h-2 rounded-full p-2'>D</p>
              <h1 className='text-rose-500 text-xs md:text-2xl font-semibold'>Daily Blog</h1> 
             <p className='bg-rose-500 flex items-center justify-center w-2.5 h-2.5 p-2 text-white text-xs md:text-2xl md:w-4 md:h-4 rounded-full md:p-4'>D</p>
              <h1 className='flex gap-1 text-rose-500 text-xs md:text-2xl font-semibold'> <span className='text-slate-800'>Daily</span>Blog</h1> 
             <p className='bg-rose-500 flex items-center justify-center w-2.5 h-2.5 p-2 text-white text-xs md:text-2xl md:w-4 md:h-4 rounded-full md:p-4'>D</p>
              <h1 className='flex gap-1 text-rose-500 text-xs md:text-2xl font-semibold'> <h1 className='text-slate-800'>Daily</h1>Blog</h1> 
          </Link>
    </div>
  )
}

export default Logo
