import { FC, MouseEvent } from 'react'
import { IBackupList } from '../../interface/backupList'
import { Button } from '../UI/Button'

interface ModalBackupProps {
  list: IBackupList[]
  restoreBackup: (e: MouseEvent, time: string, backup: string) => void
}

export const ModalBackup: FC<ModalBackupProps> = ({ list, restoreBackup }) => {
  return (
    <div
      className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
      id='modalBackup'
      tabIndex={-1}
      aria-labelledby='modalBackupLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog relative w-auto pointer-events-none'>
        <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current'>
          <div className='modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md'>
            <h5 className='text-xl leading-normal text-gray-800 text-center font-bold' id='modalBackupLabel'>
              Восстановить
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
              {list &&
                list.map((item) => (
                  <div className='flex justify-center' key={item.time}>
                    <div className='bg-white w-full border-b border-gray-200'>
                      <a
                        href='#!'
                        className='block px-6 py-2 w-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600 transition duration-500 cursor-pointer'
                        onClick={(e) => restoreBackup(e, item.time, item.file)}
                      >
                        Резервная копия от {item.time}
                      </a>
                    </div>
                  </div>
                ))}

              {!list.length && 'Резервных копий нет'}
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
