import { FC } from 'react'
import { Button } from '../UI/Button'
import Modal from './modal'

interface ModalConfirmProps {
  save: () => void
}

export const ModalConfirm: FC<ModalConfirmProps> = ({ save }) => {
  return (
    <Modal
      title='Сохранить изменения'
      id='confirmModal'
      footer={
        <Button clName='btn-success' dataBsDismiss onClick={save}>
          Сохранить
        </Button>
      }
    >
      Вы уверены что хотите сохранить изменения?
    </Modal>
  )
}
