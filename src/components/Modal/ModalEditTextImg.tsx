import { FC, useEffect, useState } from 'react'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface IModalEditTextImg {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const ModalEditTextImg: FC<IModalEditTextImg> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const { id, text, element, selector } = useAppSelector((state) => state.setText)
  const [newText, setNewText] = useState('')
  const [virtualElem, setVirtualElem] = useState() as any
  const [elText, setElText] = useState<HTMLElement>()
  const [elImg, setElImg] = useState<HTMLImageElement>()
  const { setText } = userActions()

  useEffect(() => {
    if (text !== '') {
      setNewText(text)
      const virEl = virtualDom?.body.querySelector(selector) as any
      setVirtualElem(virEl)
      const currentEl = iframe?.contentDocument?.body.querySelector(selector) as any

      if (element === 'img') {
        setElImg(currentEl)
      }
      if (element === 'text') {
        setElText(currentEl)
      }
    }
  }, [text])

  const onChange = (value: string) => {
    setNewText(value)
  }

  const save = () => {
    if (elImg && element === 'img') {
      elImg.setAttribute('alt', newText)
      virtualElem.alt = elImg.alt
    }
    if (elText && element === 'text') {
      elText.innerHTML = newText
      virtualElem.innerHTML = newText
      setText({ id, text: newText, element, selector })
    }

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
