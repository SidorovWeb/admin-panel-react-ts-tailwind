import { FC } from 'react'
import { Button } from '../UI/Button'
import Modal from './modal'

export const ModalEditTextImg: FC = () => {
  const save = () => {}

  return (
    <Modal
      title='Редактирование'
      id='modalEditTextImg'
      footer={
        <Button clName='btn-success' dataBsDismiss onClick={save}>
          Сохранить
        </Button>
      }
    >
      <form className='space-y-3'>
        <input
          type='text'
          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
    !mt-1 !mb-2 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          placeholder='Введите текст'
        />
      </form>
    </Modal>
  )
}
