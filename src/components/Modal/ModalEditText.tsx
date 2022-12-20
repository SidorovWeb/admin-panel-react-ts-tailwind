import { FC, useEffect, useRef, useState } from 'react'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface IModalEditText {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const ModalEditText: FC<IModalEditText> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const input = useRef<HTMLInputElement>(null)
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
      setText({ id, text: newText, element, selector })
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
      id='modalEditText'
      footer={
        <Button clName='btn-success' dataBsDismiss onClick={save}>
          Сохранить
        </Button>
      }
    >
      <form className='space-y-3'>
        <input
          type='text'
          className='block w-full px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded transition-opacity duration-300 ease-in-out hover:opacity-50 !mt-1 !mb-2 focus:border-blue-600 focus:outline-none'
          placeholder='Введите текст'
          onChange={(e) => onChange(e.target.value)}
          value={newText}
          ref={input}
        />
      </form>
    </Modal>
  )
}
