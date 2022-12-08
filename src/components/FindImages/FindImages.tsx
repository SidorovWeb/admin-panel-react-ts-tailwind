import React, { FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'
import { uploadImage } from '../../helpers/Images'

interface IFindImages {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  setLoading: (state: boolean) => void
}

interface IMapImages {
  img: HTMLImageElement
  id: string
  src: string
  name: string
  width: number
  height: number
}

export const FindImages: FC<IFindImages> = ({ virtualDom, setVirtualDom, setLoading }) => {
  const iframe = document.querySelector('iframe')
  const [search, setSearch] = useState('')
  const images = iframe?.contentDocument?.body.querySelectorAll(`.img-editor-app`)

  let mapImages =
    images &&
    [...images].map((i) => {
      const img = i as HTMLImageElement
      const id = img.getAttribute('img-editor-app') as string
      const src = img.currentSrc as string
      const name = img.getAttribute('alt') as string
      const width = img.naturalWidth as number
      const height = img.naturalHeight as number
      return {
        img,
        id,
        src,
        name,
        width,
        height,
      }
    })

  const filteredImages =
    mapImages && mapImages.filter((obj) => obj.name.toLowerCase().trim().includes(search.toLowerCase().trim()))

  const upload = (img: HTMLImageElement, id: string) => {
    uploadImage(img, id, virtualDom, setVirtualDom, setLoading).then((res: any) => {
      mapImages = mapImages?.map((el) => {
        if (el.id === id) {
          el.src = res
          return el
        }
        return el
      })
    })
  }

  return (
    <div className='fixed inset-0 overflow-y-auto z-30 bg-white p-4'>
      <div className='pt-6'>
        <div className='font-bold text-left text-2xl mb-2'>Изображения</div>
      </div>
      <div className='flex flex-col items-center justify-center max-w-[1180px] mx-auto'>
        <div className='mb-3 xl:w-96'>
          <input
            type='search'
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-6 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleSearch'
            placeholder='Имя изображения'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center w-full'>
          {filteredImages &&
            [...filteredImages].map((img, idx) => (
              <div
                className='flex justify-center hover:shadow-lg transition duration-300 ease-in-out rounded-lg'
                key={idx}
              >
                <div className='rounded-lg shadow-lg bg-white w-full'>
                  <img
                    className='rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px]'
                    src={img.src}
                    alt={img.name}
                  />
                  <div className='p-4'>
                    <p className='text-gray-700 text-base mb-1'>Name: {img.name}</p>
                    <p className='text-gray-700 text-base mb-1'>Width: {img.width}px</p>
                    <p className='text-gray-700 text-base mb-2'>Height: {img.height}px</p>
                  </div>
                  <div className='text-center'>
                    <Button clName='btn-primary mb-4 mr-2' onClick={() => upload(img.img, img.id)}>
                      Upload
                    </Button>
                    <Button clName='btn-primary mb-4'>Edit</Button>
                  </div>
                </div>
              </div>
            ))}

          {filteredImages && !filteredImages.length && <div className='text-xl mb-2'>Имя не найдено</div>}
        </div>
      </div>
    </div>
  )
}
