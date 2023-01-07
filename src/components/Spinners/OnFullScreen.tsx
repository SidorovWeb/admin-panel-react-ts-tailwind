import { FC } from 'react'

interface IOnFullScreen {}

export const OnFullScreen: FC<IOnFullScreen> = () => {
  return (
    <div className='bg-white dark:bg-slate-800 text-gray-700 dark:text-white font-light flex justify-center items-center min-h-screen !z-[999] fixed top-0 left-0 right-0 bottom-0 space-x-1'>
      <span className='loader'></span>
    </div>
  )
}
