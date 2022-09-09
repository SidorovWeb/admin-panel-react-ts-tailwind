import { FC, useEffect, useState } from 'react'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'
import Modal from './modal'

interface IModalEditTextImg {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const ModalEditTextImg: FC<IModalEditTextImg> = ({ virtualDom, setVirtualDom }) => {
  const { id, text } = useAppSelector((state) => state.controlImg)
  const { getDataImg } = userActions()
  const [newText, setNewText] = useState('')
  const iframe = document.querySelector('iframe')
  const virtualElem = virtualDom?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
  const img = iframe?.contentDocument?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement

  useEffect(() => {
    setNewText(text)
  }, [text])

  const onChange = (value: string) => {
    setNewText(value)
  }

  const save = () => {
    img.setAttribute('alt', newText)
    getDataImg({ id, text: newText })
    virtualElem.alt = img.alt
    setVirtualDom(virtualDom)
  }

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
          onChange={(e) => onChange(e.target.value)}
          value={newText}
        />
      </form>
    </Modal>
  )
}
