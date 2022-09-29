import axios from 'axios'
import { FC } from 'react'
import { pathAPI } from '../../Constants'
import { Button } from '../UI/Button'
import Modal from './Modal'

export const ModalLogout: FC = () => {
  const logout = () => {
    // axios.get(`${pathAPI}logout.php`).then(() => {
    //   window.location.replace('/')
    // })
    console.log('logout')
  }
  return (
    <Modal
      title='Выйти'
      id='modalLogout'
      footer={
        <Button clName='btn-danger' dataBsDismiss onClick={logout}>
          Выйти
        </Button>
      }
    >
      Вы уверены что хотите выйти?
    </Modal>
  )
}
