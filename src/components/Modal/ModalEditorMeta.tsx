import { FC, useEffect, useState } from 'react'
import { MdContentCopy } from 'react-icons/md'
import { toast } from 'react-toastify'
import { toPublish } from '../../helpers/utils'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface ModalEditorMetaProps {
  virtualDom: Document
  currentPage: string
}

export const ModalEditorMeta: FC<ModalEditorMetaProps> = ({ virtualDom, currentPage }) => {
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const styleInput =
    'form-control block w-full px-3 py-1.5 text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded transition-opacity duration-300 ease-in-out hover:opacity-50 !mt-1 !mb-2 focus:border-blue-600 focus:outline-none'

  useEffect(() => {
    getMeta(virtualDom)
    setUrl(window.location.href + currentPage)
  }, [virtualDom])

  const getMeta = (virtualDom: Document) => {
    const title =
      virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title'))
    setTitle(title.innerHTML)

    let keywords = virtualDom.head.querySelector('meta[name="keywords"]')
    if (!keywords) {
      keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'))
      keywords.setAttribute('name', 'keywords')
    }
    setKeywords(keywords.getAttribute('content') || '')

    let description = virtualDom.head.querySelector('meta[name="description"]')

    if (!description) {
      description = virtualDom.head.appendChild(virtualDom.createElement('meta'))
      description.setAttribute('name', 'description')
    }

    setDescription(description.getAttribute('content') || '')
  }

  const applyMeta = () => {
    const t = virtualDom.head.querySelector('title')
    if (t) {
      t?.setAttribute('content', title)
      t.innerHTML = title
    }

    const keyW = virtualDom.head.querySelector('meta[name="keywords"]')
    keyW?.setAttribute('content', keywords)
    const desc = virtualDom.head.querySelector('meta[name="description"]')
    desc?.setAttribute('content', description)
  }

  return (
    <Modal
      title='Редактирование Meta-тэгов'
      id='modalEditorMeta'
      footer={
        <Button
          clName='btn-success'
          dataBsDismiss
          onClick={() => {
            applyMeta()
            toPublish({ newVirtualDom: virtualDom, currentPage })
          }}
        >
          Сохранить
        </Button>
      }
    >
      <form className='space-y-3'>
        <label className='form-label inline-block font-medium'>Page title</label>
        <input
          type='text'
          className={styleInput}
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className='form-label inline-block font-medium'>Page keywords</label>
        <textarea
          className={styleInput}
          rows={3}
          placeholder='Keywords'
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        ></textarea>
        <label className='form-label inline-block font-medium'>Page description</label>
        <textarea
          className={styleInput}
          rows={3}
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className='flex flex-wrap items-center space-x-4'>
          <p className='text-sm text-blue-700 url-text-apsw font-medium'>{url}</p>
          <Button
            clName='btn-primary !text-[10px]'
            onClick={() => {
              const text = document.querySelector('.url-text-apsw')?.innerHTML
              if (text) {
                navigator.clipboard.writeText(text)
                toast.success(`Скопировано`)
              }
            }}
          >
            <MdContentCopy className='w-full h-[18px]' />
          </Button>
        </div>
      </form>
    </Modal>
  )
}
