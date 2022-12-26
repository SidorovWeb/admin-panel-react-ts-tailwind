import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { pathAPI } from '../../../Constants'
import { useAppSelector } from '../../../hooks/redux'
import { Button } from '../../UI/Button'

interface IEditorUploads {}
interface IUploadsImages {
  name: string
  path: string
  isUsed: boolean
  id: number
}

export const EditorUploads: FC<IEditorUploads> = () => {
  const path = import.meta.env.MODE === 'development' ? '../api/' : './api/'
  const { images } = useAppSelector((state) => state.getImage)
  const [uploadsImages, setUploadsImages] = useState<IUploadsImages[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    axios
      .get<[]>(`${pathAPI}getUploadsImage.php`)
      .then((res) => {
        const uploadsList = [] as IUploadsImages[]
        res.data.forEach((nameFile, idx) => {
          uploadsList.push({ name: nameFile, path: `${path}upload_image/${nameFile}`, isUsed: false, id: idx })
        })

        // const newList2 = [] as IUploadsImages[]

        // uploadsList.forEach((item) => {
        //   images.forEach((img) => {
        //     if (img.src.includes(item.name)) {
        //       newList2.push({ ...item, isUsed: true })
        //       return
        //     }
        //   })
        // })

        // console.log(newList2)

        setUploadsImages(uploadsList)
      })
      .catch((e) => toast.error(`Error! ${e}`))
  }, [])

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center w-full'>
        {uploadsImages.map((img, idx) => (
          <div
            key={idx}
            className='flex flex-col space-y-4 hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-slate-200 dark:border-slate-700'
          >
            <img
              className='rounded-t-lg w-full object-cover min-h-[210px] max-h-[210px] bg-slate-200 dark:bg-slate-500'
              src={img.path}
              alt=''
            />
            <div className='px-4'>
              <p className='text-inherit text-base font-medium'>
                {t('nameImage')}: {img.name}
              </p>
            </div>
            <div className='flex items-center justify-between p-4'>
              <span>Используется</span>
              <Button clName='btn-danger'>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
