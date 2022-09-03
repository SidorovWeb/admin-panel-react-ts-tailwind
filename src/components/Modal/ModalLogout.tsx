import axios from 'axios'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { pathAPI } from '../../Constants'
import { Button } from '../UI/Button'

export const ModalLogout: FC = () => {
  // const navigate = useNavigate()
  const logout = () => {
    // axios.get(`${pathAPI}logout.php`).then(() => navigate('/'))
  }
  return (
    <div
      className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
      id='modalLogout'
      tabIndex={-1}
      aria-labelledby='modalLogoutLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog relative w-auto pointer-events-none'>
        <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current'>
          <div className='modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md'>
            <h5 className='text-xl leading-normal text-gray-800 text-center font-bold' id='modalLogoutLabel'>
              Выйти
            </h5>
            <button
              type='button'
              className='btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body relative p-4'>Вы уверены что хотите выйти?</div>
          <div className='modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 rounded-b-md space-x-2'>
            <Button clName='btn-secondary' dataBsDismiss>
              Отмена
            </Button>
            <Button clName='btn-danger' dataBsDismiss onClick={logout}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
