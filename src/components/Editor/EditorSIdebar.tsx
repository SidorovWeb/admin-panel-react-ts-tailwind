import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MdBarChart, MdCode, MdOutlineCloudUpload, MdOutlineImage, MdOutlineShortText } from 'react-icons/md'

interface IEditorSIdebar {
  switcher: string
  setSwitcher: (str: string) => void
}

export const EditorSIdebar: FC<IEditorSIdebar> = ({ switcher, setSwitcher }) => {
  const { t } = useTranslation()

  return (
    <div className='relative'>
      <div className='space-y-4 pr-[80px] sticky top-10'>
        <a
          href='!#'
          className={`${
            switcher === 'Dashboard' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Dashboard')
          }}
        >
          <MdBarChart className='w-5 h-5' />
          <p>{t('Dashboard')}</p>
        </a>
        <a
          href='!#'
          className={`${
            switcher === 'Images' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Images')
          }}
        >
          <MdOutlineImage className='w-5 h-5' />
          <p>{t('Images')}</p>
        </a>
        <a
          href='!#'
          className={`${
            switcher === 'Text' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Text')
          }}
        >
          <MdOutlineShortText className='w-5 h-5' />
          <p>{t('Text')}</p>
        </a>
        <a
          href='!#'
          className={`${
            switcher === 'Code' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Code')
          }}
        >
          <MdCode className='w-5 h-5' />
          <p>{t('Code')}</p>
        </a>
        <a
          href='!#'
          className={`${
            switcher === 'Upload Image' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Uploads')
          }}
        >
          <MdOutlineCloudUpload className='w-5 h-5' />
          <p>{t('Uploads')}</p>
        </a>
      </div>
    </div>
  )
}
