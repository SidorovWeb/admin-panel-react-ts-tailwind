import { FC, MouseEvent } from 'react'
import { Button } from '../UI/Button'

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
    <div
      className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
      id='modalChoose'
      tabIndex={-1}
      aria-labelledby='modalChooseLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog relative w-auto pointer-events-none'>
        <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current'>
          <div className='modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md'>
            <h5 className='text-xl leading-normal text-gray-800 text-center font-bold' id='modalChooseLabel'>
              Открыть
            </h5>
            <button
              type='button'
              className='btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body relative p-4'>
            <div>
              {pages &&
                pages.map((page: string, idx: number) => (
                  <div className='flex justify-center' key={idx}>
                    <div className='bg-white w-full border-b border-gray-200'>
                      {/* <a
                        href='#!'
                        aria-current='true'
                        className='block px-6 py-2 border-b border-gray-200 w-full rounded-t-lg bg-blue-600 text-white cursor-pointer'
                      >

                      </a> */}
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
          </div>
          <div className='modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 rounded-b-md space-x-2'>
            <Button clName='btn-secondary' dataBsDismiss>
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
