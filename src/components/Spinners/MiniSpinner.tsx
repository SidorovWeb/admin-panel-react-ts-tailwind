import React, { FC } from 'react'

interface IMiniSpinner {
  active: boolean
}

export const MiniSpinner: FC<IMiniSpinner> = ({ active }) => {
  return (
    <div className='w-full text-center flex justify-center item-center'>
      <div className='spinner-border animate-spin  w-8 h-8 border-4 rounded-full text-slate-300' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
