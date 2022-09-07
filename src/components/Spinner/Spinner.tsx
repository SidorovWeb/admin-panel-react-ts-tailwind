import { FC } from 'react'

interface SpinnerProps {
  active: boolean
}

export const Spinner: FC<SpinnerProps> = ({ active }) => {
  return (
    <>
      {active && (
        <div className='flex justify-center items-center min-h-screen bg-gray-700 fixed top-0 left-0 right-0 bottom-0 space-x-1 z-[999]'>
          <div
            className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-yellow-500'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
          <div
            className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-blue-500'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
          <div
            className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-purple-500'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )}
    </>
  )
}
