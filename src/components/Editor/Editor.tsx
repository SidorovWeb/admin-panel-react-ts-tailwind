import { FC, useEffect, useState } from 'react'
import { MdOutlineLogout } from 'react-icons/md'
import { userActions } from '../../hooks/actions'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'
import { ThemeToggle } from '../UI/ThemeToggle'
import { Dashboard } from './Dashboard/Dashboard'
import { EditorCode } from './EditorCode/EditorCode'
import { EditorImages } from './EditorImages/EditorImages'
import { EditorText } from './EditorText/EditorText'
import { Select } from '../UI/Select'
import { useTranslation } from 'react-i18next'
import { EditorSIdebar } from './EditorSIdebar'
import { EditorUploads } from './EditorUploads/EditorUploads'

interface IEditor {
  currentPage: string
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

const Editor: FC<IEditor> = ({ currentPage, virtualDom, setVirtualDom }) => {
  const active = useAppSelector((state) => state.codeEditor.active)
  const [switcher, setSwitcher] = useState('')
  const { inactiveCodeEditor } = userActions()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (active) {
      setSwitcher('Dashboard')
    }
  }, [active])

  const close = () => {
    inactiveCodeEditor()
    setSwitcher('')
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className={`${active ? '' : 'fade hidden'} fixed inset-0 overflow-y-auto z-30 bg-inherit pt-[64px]`}>
      <div className='fixed top-0 left-0 right-0 z-10 bg-white dark:bg-slate-800 py-4 h-[64px] border-b border-slate-200 dark:border-slate-700'>
        <div className='max-w-[1280px] m-auto px-[30px] w-full flex items-center justify-between'>
          <span className='font-bold'>APSA</span>
          <div className='flex items-stretch space-x-2'>
            <ThemeToggle />
            <Select array={['ru', 'en']} setSelect={changeLanguage} defaultValue={i18n.language} />
            <Button clName='btn-default flex items-center' onClick={close}>
              <MdOutlineLogout className='w-full h-[15px] -mt-[2px] mr-1' />
              <p>{t('close')}</p>
            </Button>
          </div>
        </div>
      </div>
      <div className='max-w-[1280px] m-auto px-[30px]'>
        <div className='flex mt-10 mb-20'>
          <EditorSIdebar switcher={switcher} setSwitcher={setSwitcher} />
          <div className='editor-content flex flex-col flex-1 min-h-screen relative'>
            <div className='font-bold text-left text-4xl mb-10'>{t(switcher)}</div>

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
            {switcher === 'Uploads' && <EditorUploads />}

            <div className='flex items-center justify-center p-8 space-x-4 mt-auto'>
              <p>APSA</p>
              <a href='tg://resolve?domain=SidorovAlexander'>© Aleksandr Sidorov</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
