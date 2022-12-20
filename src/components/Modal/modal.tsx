import React, { FC } from 'react'
import { MdClose } from 'react-icons/md'
import { Button } from '../UI/Button'

interface IModal {
  title: string
  id: string
  footer?: React.ReactNode
  children: React.ReactNode
}

const Modal: FC<IModal> = ({ title, id, footer, children }) => (
  <div
    className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
    id={id}
    tabIndex={-1}
    aria-hidden='true'
  >
    <div className='modal-dialog modal-dialog-centered relative w-auto pointer-events-none'>
      <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white dark:bg-slate-800 bg-clip-padding rounded-md outline-none text-current'>
        <div className='modal-header flex flex-shrink-0 items-center justify-between p-6 rounded-t-md'>
          <h5 className='text-xl leading-normal text-center font-medium' id={`${id}Label`}>
            {title}
          </h5>
        </div>
        <div className='modal-body relative p-6 mb-4'>{children}</div>
        <div className='modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-6 pt-0 rounded-b-md space-x-2'>
          <Button clName='btn-secondary' dataBsDismiss>
            Закрыть
          </Button>
          {footer}
        </div>
      </div>
    </div>
  </div>
)

export default Modal
