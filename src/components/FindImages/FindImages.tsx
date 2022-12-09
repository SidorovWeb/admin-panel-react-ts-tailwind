import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button } from '../UI/Button'
import { uploadImage } from '../../helpers/Images'
import { FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { pathAPI } from '../../Constants'
import { toast } from 'react-toastify'
import { userActions } from '../../hooks/actions'

interface IFindImages {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

interface IMapImages {
  img: HTMLImageElement
  id: string
  src: string
  name: string
  width: number
  height: number
}

export const FindImages: FC<IFindImages> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const images = iframe?.contentDocument?.body.querySelectorAll(`.img-editor-app`)
  const [search, setSearch] = useState('')
  const [filteredImages, setFilteredImages] = useState<IMapImages[]>()
  const [imagesList, setImagesList] = useState<IMapImages[]>()
  const { setDataImg } = userActions()

  useEffect(() => {
    const mapImages =
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

    setImagesList(mapImages)
  }, [])

  useEffect(() => {
    filtersImages()
  }, [imagesList])

  const filtersImages = (str?: string) => {
    if (!str) {
      setFilteredImages(imagesList)
      return
    }
    if (imagesList && str) {
      const fil = imagesList.filter((obj) => obj.name.toLowerCase().trim().includes(str.toLowerCase().trim()))
      setFilteredImages(fil)
    }
  }

  const onSearch = (str: string) => {
    filtersImages(str)
    setSearch(str)
  }

  const onUpload = (img: any, id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(img, id, virtualDom, setVirtualDom, e.target.files[0]).then((res: any) => {
        const newList =
          imagesList &&
          imagesList?.map((el) => {
            if (el.id === id) {
              el.src = res
              return el
            }
            return el
          })

        setFilteredImages(newList)
      })
    }
  }

  const getDataImg = (name: string, id: string) => {
    if (virtualDom) {
      console.log(id)

      setDataImg({ id: Number(id), text: name })
    }
  }

  return (
    <div className='fixed inset-0 overflow-y-auto z-30 bg-white p-4'>
      <div className='flex flex-col items-center justify-center max-w-[1180px] mx-auto'>
        <div className='pt-6 text-left w-full'>
          <div className='font-bold text-left text-2xl mb-2'>Изображения</div>
        </div>
        <div className='mb-3 relative w-full'>
          <FiSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4]' />
          <input
            type='search'
            className='form-control block w-full px-8 py-1.5 mx-0 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-6 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            id='exampleSearch'
            placeholder='Имя изображения'
            value={search}
            onChange={(e) => onSearch(e.target.value)}
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
                    <Button clName='relative btn-primary mb-4 mr-2 overflow-hidden cursor-pointer'>
                      Select a file
                      <label className='flex flex-col items-center cursor-pointer absolute inset-0'>
                        <input type='file' className='hidden' onChange={(e) => onUpload(img.img, img.id, e)} />
                      </label>
                    </Button>
                    <Button
                      clName='btn-primary mb-4'
                      onClick={() => getDataImg(img.name, img.id)}
                      dataBsToggle
                      dataBsTarget='#modalEditTextImg'
                    >
                      Edit
                    </Button>
                    TODO: редактирование алта. Неоюходимо обновление массива
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
