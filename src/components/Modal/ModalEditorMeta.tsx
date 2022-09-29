import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../UI/Button'
import Modal from './Modal'

interface ModalEditorMetaProps {
  virtualDom: Document
  save: () => void
  currentPage: string
}

export const ModalEditorMeta: FC<ModalEditorMetaProps> = ({ virtualDom, save, currentPage }) => {
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

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
            save()
          }}
        >
          Сохранить
        </Button>
      }
    >
      <form className='space-y-3'>
        <label className='font-bold form-label inline-block text-gray-700'>Page title</label>
        <input
          type='text'
          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                !mt-1 !mb-2 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className='font-bold form-label inline-block text-gray-700'>Page keywords</label>
        <textarea
          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-whitebg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out !mt-1 !mb-2 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          rows={3}
          placeholder='Keywords'
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        ></textarea>
        <label className='font-bold form-label inline-block text-gray-700'>Page description</label>
        <textarea
          className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out !mt-1 !mb-2 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          rows={3}
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className='flex flex-wrap items-center justify-between space-x-4'>
          <p className='text-sm text-blue-700 url-text-apsw'>{url}</p>
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
            Copy
          </Button>
        </div>
      </form>
    </Modal>
  )
}
