import { FC, MouseEvent } from 'react'
import { Button } from '../UI/Button'
import Modal from './modal'

interface ModalChooseProps {
  pages: string[]
  setCurrentPage: (page: string) => void
}

export const ModalChoose: FC<ModalChooseProps> = ({ pages, setCurrentPage }) => {
  const redirect = (e: MouseEvent, page: string) => {
    e.preventDefault()
    setCurrentPage(page)
    const LS = JSON.parse(localStorage.getItem('apsw')!)
    localStorage.setItem('apsw', JSON.stringify({ ...LS, page }))
  }

  return (
    <Modal title='Открыть' id='modalChoose'>
      {' '}
      <div>
        {pages &&
          pages.map((page: string, idx: number) => (
            <div className='flex justify-center' key={idx}>
              <div className='bg-white w-full border-b border-gray-200'>
                <a
                  href='#!'
                  className='block px-6 py-2 w-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600 transition duration-500 cursor-pointer'
                  onClick={(e) => redirect(e, page)}
                >
                  {page}
                </a>
              </div>
            </div>
          ))}
      </div>
    </Modal>
  )
}
