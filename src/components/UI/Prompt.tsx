import React, { FC, useEffect, useState } from 'react'
import { Button } from './Button'

export const Prompt: FC = () => {
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('apsa-prompt')) {
      setIsSuccess(true)
    }
  }, [])

  const onClick = () => {
    localStorage.setItem('apsa-prompt', 'true')
    setIsSuccess(true)
  }

  return !isSuccess ? (
    <div className='fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-999 p-6 bg-amber-100 dark:text-gray-700 font-medium rounded-lg space-y-4 hover:shadow-lg transition-shadow duration-300 ease-in-out'>
      <div className='flex items-center'>
        <p> Для редактирования текста наведите и нажмите правую кнопку мыши</p>
        <svg
          fill='currentColor'
          version='1.1'
          id='Capa_1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='30px'
          height='30px'
          viewBox='0 0 417.031 417.031'
          xmlSpace='preserve'
        >
          <g>
            <path
              fill='currentColor'
              d='M219.683,92.146c-0.279-0.315-0.52-0.627-0.849-0.925c-3.644-3.272-3.742-2.306,0.247-5.983
c2.955-2.712,6.541-4.834,9.79-7.18c8.596-6.213,14.254-14.534,18.079-24.399c8.582-22.15-16.706-37.453-29.396-50.562
c-9.168-9.485-23.603,4.982-14.444,14.447c7.076,7.325,16.19,13.264,22.349,21.407c6.897,9.116-3.613,19.174-10.814,24.249
c-11.133,7.844-20.757,18.262-18.533,29.434c-49.964,4.668-96.16,32.052-96.16,80.327v135.51
c0,59.862,48.698,108.562,108.564,108.562c59.863,0,108.566-48.7,108.566-108.562V172.95
C317.085,120.247,268.05,94.723,219.683,92.146z M120.391,172.95c0-35.833,38.898-56.581,79.186-60.027v124.982
c-36.751-1.85-66.589-10.222-79.186-14.309V172.95z M296.648,308.461c0,48.604-39.537,88.133-88.129,88.133
c-48.59,0-88.128-39.529-88.128-88.133V245.08c18.249,5.516,52.6,13.882,93.202,13.882c26.003,0,54.556-3.479,83.056-13.286
V308.461z M296.648,223.94c-25.844,9.883-52.237,13.746-76.635,14.271v-125.59c39.407,2.363,76.635,21.264,76.635,60.337V223.94z
M289.735,216.203c0,0-46.688,13.073-62.567,10.271V122.813C269.429,130.753,296.625,143.533,289.735,216.203z'
            />
          </g>
        </svg>
      </div>
      <div className='text-right '>
        <Button clName='btn-success' onClick={onClick}>
          Понял!
        </Button>
      </div>
    </div>
  ) : (
    <></>
  )
}
