import { FC, useEffect, useRef, useState } from 'react'
import { MdBarChart, MdCode, MdOutlineImage, MdOutlineLogout, MdOutlineShortText } from 'react-icons/md'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'
import { ThemeToggle } from '../UI/ThemeToggle/ThemeToggle'
import { Dashboard } from './Dashboard/Dashboard'
import { EditorCode } from './EditorCode/EditorCode'
import { EditorImages } from './EditorImages/EditorImages'
import { EditorText } from './EditorText/EditorText'

interface IEditor {
  currentPage: string
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const Editor: FC<IEditor> = ({ currentPage, virtualDom, setVirtualDom }) => {
  const active = useAppSelector((state) => state.codeEditor.active)
  const [switcher, setSwitcher] = useState('')
  const { inactiveCodeEditor } = userActions()

  useEffect(() => {
    if (active) {
      setSwitcher('Dashboard')
    }
  }, [active])

  const close = () => {
    inactiveCodeEditor()
    setSwitcher('')
  }

  return (
    <div className={`${active ? '' : 'fade hidden'} fixed inset-0 overflow-y-auto z-30 bg-inherit`}>
      <div className='finder-header py-4 border-b border-slate-200 dark:border-slate-700'>
        <div className='max-w-[1280px] m-auto px-[30px] w-full flex items-center justify-between'>
          <span className='font-bold'>APSA</span>
          <div className='flex items-center space-x-2'>
            <ThemeToggle />
            <Button clName='btn-default flex items-center'>lang</Button>
            <Button clName='btn-default flex items-center' onClick={close}>
              <MdOutlineLogout className='w-full h-[15px] -mt-[2px] mr-1' />
              <p>Закрыть</p>
            </Button>
          </div>
        </div>
      </div>
      <div className='finder-container max-w-[1280px] m-auto px-[30px]'>
        <div className='finder-main flex mt-10 mb-20'>
          <div className='finder-sidebar space-y-4 pr-[80px]'>
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
              <p>Dashboard</p>
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
              <p>Images</p>
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
              <p>Text</p>
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
              <p>Code</p>
            </a>
          </div>
          <div className='finder-content flex flex-col flex-1 min-h-screen relative'>
            <div className='font-bold text-left text-4xl mb-10'>{switcher}</div>
            {switcher === 'Dashboard' && <Dashboard />}
            {switcher === 'Images' && (
              <EditorImages virtualDom={virtualDom} setVirtualDom={setVirtualDom} currentPage={currentPage} />
            )}
            {switcher === 'Text' && (
              <EditorText virtualDom={virtualDom} setVirtualDom={setVirtualDom} currentPage={currentPage} />
            )}
            {switcher === 'Code' && (
              <EditorCode virtualDom={virtualDom} currentPage={currentPage} setVirtualDom={setVirtualDom} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
