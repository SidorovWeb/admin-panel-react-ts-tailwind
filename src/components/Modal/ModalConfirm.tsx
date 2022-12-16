import { FC } from 'react'
import { toPublish } from '../../helpers/utils'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface ModalConfirmProps {
  virtualDom: Document
  currentPage: string
}

export const ModalConfirm: FC<ModalConfirmProps> = ({ currentPage, virtualDom }) => {
  return (
    <Modal
      title='Опубликовать изменения'
      id='confirmModal'
      footer={
        <Button
          clName='btn-success'
          dataBsDismiss
          onClick={() => toPublish({ newVirtualDom: virtualDom, currentPage })}
        >
          Опубликовать
        </Button>
      }
    >
      Вы уверены что хотите опубликовать изменения?
    </Modal>
  )
}
