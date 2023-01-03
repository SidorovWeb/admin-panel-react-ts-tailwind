import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MdBarChart, MdCode, MdOutlineCloudUpload, MdOutlineImage, MdOutlineShortText } from 'react-icons/md'

interface IEditorSIdebar {
  switcher: string
  setSwitcher: (str: string) => void
  isActiveSidebar: boolean
  setIsActiveSidebar: (val: boolean) => void
}

export const EditorSIdebar: FC<IEditorSIdebar> = ({ switcher, setSwitcher, isActiveSidebar, setIsActiveSidebar }) => {
  const { t } = useTranslation()

  return (
    <div
      className={`${
        isActiveSidebar
          ? '!block fixed top-[65px] bottom-0 pt-5 pl-8 bg-white dark:bg-slate-800 z-50 left-0 shadow-lg'
          : '!hidden'
      } md:relative hidden md:!block`}
    >
      <div className='space-y-4 pr-[80px] sticky top-10 '>
        <a
          href='!#'
          className={`${
            switcher === 'Dashboard' ? 'text-black font-medium dark:text-gray-500' : 'hover:opacity-[0.7]'
          } w-full transition-opacity duration-300 ease-in-out hover:opacity-[0.5] flex items-center space-x-1`}
          onClick={(e) => {
            e.preventDefault()
            setSwitcher('Dashboard')
            setIsActiveSidebar(false)
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
            setIsActiveSidebar(false)
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
            setIsActiveSidebar(false)
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
            setIsActiveSidebar(false)
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
            setIsActiveSidebar(false)
          }}
        >
          <MdOutlineCloudUpload className='w-5 h-5' />
          <p>{t('Uploads')}</p>
        </a>
      </div>
    </div>
  )
}
