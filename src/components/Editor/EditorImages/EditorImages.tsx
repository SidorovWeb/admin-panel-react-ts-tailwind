import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button } from '../../UI/Button'
import { uploadImage } from '../../../helpers/Images'
import { FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { pathAPI } from '../../../Constants'
import { toast } from 'react-toastify'
import { userActions } from '../../../hooks/actions'
import { useAppSelector } from '../../../hooks/redux'
import { convertBytes, imageSize } from '../../../helpers/utils'
import { MdOutlineSearch } from 'react-icons/md'

interface IEditorImages {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

interface IMapImages {
  img: HTMLImageElement
  id: number
  src: string
  name: string
  width: number
  height: number
  size: number
}

export const EditorImages: FC<IEditorImages> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const [imagesList, setImagesList] = useState<IMapImages[]>()
  const [filteredImages, setFilteredImages] = useState<IMapImages[]>()
  const [search, setSearch] = useState('')
  const { setDataImg } = userActions()
  const { id, text } = useAppSelector((state) => state.controlImg)

  useEffect(() => {
    const images = iframe?.contentDocument?.body.querySelectorAll(`.img-editor-app`)
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
          id: Number(id),
          src,
          name,
          width,
          height,
          size: 0,
        }
      })

    setImagesList(mapImages)
  }, [])

  useEffect(() => {
    if (imagesList?.length) {
      const urls = imagesList.map((img) => {
        return img.src
      })

      axios
        .post<[]>(`${pathAPI}fileSize.php`, { imgList: urls })
        .then((res) => {
          res.data.forEach((size, id) => {
            newList({ id, size })
          })
        })
        .catch((e) => toast.error(`Ошибка! ${e}`))
    }
  }, [imagesList])

  useEffect(() => {
    if (text !== '') {
      newList({ id, text })
    }
  }, [text])

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

  const onUpload = (img: HTMLImageElement, id: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      imageSize(e.target.files[0]).then((res) => {
        if (e.target.files && e.target.files[0]) {
          uploadImage({ img, id, virtualDom, setVirtualDom, file: e.target.files[0] }).then((src: any) => {
            newList({ id, src, width: res.width, height: res.height, size: res.size })
          })
        }
      })
    }
  }

  const getDataImg = (name: string, id: number) => {
    if (virtualDom) {
      setDataImg({ id: id, text: name })
    }
  }

  interface INewList {
    id: number
    text?: string
    src?: string
    width?: number
    height?: number
    size?: number
  }

  const newList = ({ id, text, src, width, height, size }: INewList) => {
    const newList =
      imagesList &&
      imagesList?.map((el) => {
        if (el.id === id) {
          if (src && width && height) {
            el.src = src
            el.width = width
            el.height = height
          }
          if (text) {
            el.name = text
          }
          if (size) {
            el.size = size
          }

          return el
        }
        return el
      })

    setFilteredImages(newList)
  }

  return (
    <>
      <div className='mb-3 relative w-full'>
        <MdOutlineSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6' />
        <input
          type='search'
          className='form-control block w-full px-10 py-1.5 mx-0 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-6 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
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
                  className='rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px] bg-slate-200'
                  src={img.src}
                  alt={img.name}
                />
                <div className='p-4'>
                  <p className='text-gray-700 text-base'>Name: {img.name}</p>
                  <p className='text-gray-700 text-base opacity-[0.8]'>Width: {img.width}px</p>
                  <p className='text-gray-700 text-base opacity-[0.8]'>Height: {img.height}px</p>
                  <p className='text-gray-700 text-base mb-2 opacity-[0.8]'>
                    Size: {convertBytes(img.size)} -{' '}
                    {img.size < 500 ? (
                      <span className='text-green-600'>Good size</span>
                    ) : (
                      <span className='text-red-600'>Bad size</span>
                    )}
                  </p>
                </div>
                <div className='text-center'>
                  <Button clName='relative btn-default mb-4 mr-2 overflow-hidden cursor-pointer'>
                    Выберите фаил
                    <label className='flex flex-col items-center cursor-pointer absolute inset-0'>
                      <input type='file' className='hidden' onChange={(e) => onUpload(img.img, img.id, e)} />
                    </label>
                  </Button>
                  <Button
                    clName='btn-default mb-4'
                    onClick={() => getDataImg(img.name, img.id)}
                    dataBsToggle
                    dataBsTarget='#modalEditTextImg'
                  >
                    Тег alt
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {filteredImages && !filteredImages.length && <div className='text-xl mb-2'>Имя не найдено</div>}
      </div>
    </>
  )
}
