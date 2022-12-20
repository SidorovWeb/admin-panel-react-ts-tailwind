import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import { Button } from '../../UI/Button'
import { uploadImage } from '../../../helpers/Images'
import { FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { pathAPI } from '../../../Constants'
import { toast } from 'react-toastify'
import { userActions } from '../../../hooks/actions'
import { useAppSelector } from '../../../hooks/redux'
import { convertBytes, imageSize, toPublish } from '../../../helpers/utils'
import { MdOutlineSearch } from 'react-icons/md'
import { parseStrDom } from '../../../helpers/dom-helpers'
import { PublishedButton } from '../../UI/PublishedButton'
import { MiniSpinner } from '../../Spinners/MiniSpinner'

interface IEditorImages {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  currentPage: string
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

interface INewList {
  id: number
  text?: string
  src?: string
  width?: number
  height?: number
  size?: number
}

export const EditorImages: FC<IEditorImages> = ({ virtualDom, setVirtualDom, currentPage }) => {
  const iframe = document.querySelector('iframe')
  const [imagesList, setImagesList] = useState<IMapImages[]>()
  const [filteredImages, setFilteredImages] = useState<IMapImages[]>()
  const [search, setSearch] = useState('')
  const { setText } = userActions()
  const { id, text } = useAppSelector((state) => state.setText)
  const [isSpinner, setIsSpinner] = useState(true)
  const serializer = new XMLSerializer()

  useEffect(() => {
    const images = iframe?.contentDocument?.body.querySelectorAll(`.img-editor-app`)
    const mapImages =
      images &&
      [...images].map((i) => {
        const img = i as HTMLImageElement
        const id = Number(img.getAttribute('img-editor-app'))
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
        .finally(() => setIsSpinner(false))
    }
  }, [imagesList])

  useEffect(() => {
    if (text !== '') {
      newList({ id, text: text })
      filter(' ')
    }
  }, [text])

  const filter = (str?: string) => {
    if (!str) {
      setFilteredImages(imagesList)
      return
    }
    if (imagesList && str) {
      const filtered = imagesList.filter((obj) => obj.name.toLowerCase().trim().includes(str.toLowerCase().trim()))
      setFilteredImages(filtered)
    }
  }

  const onSearch = (str: string) => {
    filter(str)
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

  const editingText = (name: string, id: number) => {
    if (virtualDom) {
      setText({ id: id, text: name, element: 'img', selector: `[img-editor-app="${id}"]` })
    }
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

  const published = () => {
    const newHtml = serializer.serializeToString(virtualDom)
    const document = parseStrDom(newHtml)

    toPublish({ newVirtualDom: document, currentPage })
  }

  return (
    <>
      <div className='mb-3 relative w-full'>
        <MdOutlineSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6' />
        <input
          type='search'
          className='form-control block w-full px-10 py-1.5 mx-0 text-base text-gray-700 dark:text-white bg-white dark:bg-slate-700 bg-clip-padding border dark:border-slate-700 rounded  m-6 focus:border-blue-600 focus:outline-none'
          placeholder='Имя изображения'
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {isSpinner && <MiniSpinner />}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center w-full'>
        {!isSpinner &&
          filteredImages &&
          [...filteredImages].map((img) => (
            <div
              className='flex justify-center hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-slate-200 dark:border-slate-700'
              key={img.id}
            >
              <div className='w-full'>
                <img
                  className='rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px] bg-slate-200 dark:bg-slate-500'
                  src={img.src}
                  alt={img.name}
                />
                <div className='p-4'>
                  <p className='text-inherit text-base font-medium'>Name: {img.name}</p>
                  <p className='text-inherit text-base opacity-[0.8]'>Width: {img.width}px</p>
                  <p className='text-inherit text-base opacity-[0.8]'>Height: {img.height}px</p>
                  <p className='text-inherit text-base mb-2 opacity-[0.8]'>
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
                    onClick={() => editingText(img.name, img.id)}
                    dataBsToggle
                    dataBsTarget='#modalEditText'
                  >
                    Тег alt
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {!isSpinner && filteredImages && !filteredImages.length && <div className='text-xl mb-2'>Имя не найдено</div>}
      </div>
      <PublishedButton onClick={published} />
    </>
  )
}
