import { FC } from 'react'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface ModalConfirmProps {
  save: () => void
}

export const ModalConfirm: FC<ModalConfirmProps> = ({ save }) => {
  return (
    <Modal
      title='Опубликовать изменения'
      id='confirmModal'
      footer={
        <Button clName='btn-success' dataBsDismiss onClick={save}>
          Опубликовать
        </Button>
      }
    >
      Вы уверены что хотите опубликовать изменения?
    </Modal>
  )
}
