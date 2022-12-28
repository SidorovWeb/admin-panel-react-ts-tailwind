import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { pathAPI } from '../../../Constants'
import { useAppSelector } from '../../../hooks/redux'
import { Button } from '../../UI/Button'
import { Select } from '../../UI/Select'

interface IEditorUploads {}
interface IUploadsImages {
  name: string
  path: string
  isUsed: boolean
  id: number
}

export const EditorUploads: FC<IEditorUploads> = () => {
  const path = import.meta.env.MODE === 'development' ? '../api/' : `${window.location.href.replace('apsa/', '')}/`
  const { images } = useAppSelector((state) => state.getImage)
  const [uploadsImages, setUploadsImages] = useState<IUploadsImages[]>([])
  const [filteredImages, setFilteredImages] = useState<IUploadsImages[]>([])

  const { t } = useTranslation()

  useEffect(() => {
    axios
      .get<[]>(`${pathAPI}getUploadsImage.php`)
      .then((res) => {
        const uploadsList = [] as IUploadsImages[]
        res.data.forEach((nameFile, idx) => {
          uploadsList.push({ name: nameFile, path: `${path}upload_image/${nameFile}`, isUsed: false, id: idx })
        })

        const mapList = uploadsList.map((item) => {
          const profile: any = images.find((img) => img.src.includes(item.name))
          return { ...item, isUsed: !!profile }
        })

        setUploadsImages(mapList)
        setFilteredImages(mapList)
      })
      .catch((e) => toast.error(`Error! ${e}`))
  }, [])

  const filter = (str: string) => {
    if (str === t('all')) {
      setFilteredImages(uploadsImages)
    }
    if (str === t('used')) {
      const used = uploadsImages.filter((item) => item.isUsed)
      setFilteredImages(used)
    }
    if (str === t('notUsed')) {
      const unUsed = uploadsImages.filter((item) => !item.isUsed)
      setFilteredImages(unUsed)
    }
  }

  const notUsedList = () => {
    return uploadsImages.filter((item) => item.isUsed === false)
  }
  const usedList = () => {
    return uploadsImages.filter((item) => item.isUsed)
  }

  const deleteImage = (img: IUploadsImages) => {
    axios
      .post(`${pathAPI}deletingImage.php`, { arraySrc: [img.path] })
      .then(() => {
        const filtered = uploadsImages.filter((item) => item.id !== img.id)

        setUploadsImages(filtered)
        setFilteredImages(filtered)
        toast.success('Фаил успешно удален!')
      })
      .catch((e) => toast.error(`Удалить не удалось:  ${e}`))
  }

  const deleteNotUsedImages = () => {
    const list = notUsedList().map((img) => img.path)
    axios
      .post(`${pathAPI}deletingImage.php`, { arraySrc: list })
      .then(() => {
        const filtered = uploadsImages.filter((item) => item.isUsed)

        setUploadsImages(filtered)
        setFilteredImages(filtered)
        toast.success('Файлы успешно удалены!')
      })
      .catch((e) => toast.error(`Удалить не удалось:  ${e}`))
  }

  return (
    <div className='space-y-4'>
      {filteredImages.length > 0 && notUsedList().length > 0 && (
        <div className='bg-red-200 dark:text-gray-700 p-4 rounded-lg flex item-center justify-between'>
          <p>Удалить все неиспользуемые изображения ({notUsedList().length})</p>
          <Button clName='btn-danger flex item-center space-x-1' onClick={deleteNotUsedImages}>
            <MdDeleteOutline className='w-full h-[16px] -mt-[2px]' />
            <p>{t('delete')}</p>
          </Button>
        </div>
      )}

      <div className='bg-amber-100 dark:text-gray-700 p-4 rounded-lg'>{t('imagesStored')} "./upload_image"</div>
      <div className='flex items-center justify-between'>
        <Select array={[t('all'), t('used'), t('notUsed')]} setSelect={filter} />
        <p>
          {t('quantity')}: {filteredImages.length}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center w-full'>
        {filteredImages.length > 0 ? (
          filteredImages.map((img, idx) => (
            <div
              key={idx}
              className='flex flex-col space-y-4 hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-slate-200 dark:border-slate-700'
            >
              <img
                className='rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px] bg-slate-200 dark:bg-slate-500'
                src={img.path}
                alt={img.name}
                loading='lazy'
              />
              <div className='px-4'>
                <p className='text-inherit text-base font-medium'>
                  {t('nameImage')}: {img.name}
                </p>
              </div>
              <div className='flex items-center justify-between p-4'>
                <p className={`${img.isUsed ? 'text-green-600' : 'text-red-600'}`}>
                  {img.isUsed ? t('used') : t('notUsed')}
                </p>
                {img.isUsed === false && (
                  <Button clName='btn-danger flex item-center space-x-1' onClick={() => deleteImage(img)}>
                    <MdDeleteOutline className='w-full h-[16px] -mt-[2px]' />
                    <p>{t('delete')}</p>
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='text-xl mt-6'>Изображений нет</div>
        )}
      </div>
    </div>
  )
}
