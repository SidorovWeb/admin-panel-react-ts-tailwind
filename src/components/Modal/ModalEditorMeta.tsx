import { FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'

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
    <div
      className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
      id='modalEditorMeta'
      tabIndex={-1}
      aria-labelledby='modalEditorMetaLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog relative w-auto pointer-events-none'>
        <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current'>
          <div className='modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md'>
            <h5 className='text-xl leading-normal text-gray-800 text-center font-bold' id='modalEditorMetaLabel'>
              Редактирование Meta-тэгов
            </h5>
            <button
              type='button'
              className='btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body relative p-4'>
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
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            </form>
          </div>
          <div className='modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 rounded-b-md space-x-2'>
            <Button clName='btn-secondary' dataBsDismiss>
              Отмена
            </Button>
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
          </div>
        </div>
      </div>
    </div>
  )
}
