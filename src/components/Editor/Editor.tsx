import { FC, useEffect, useRef, useState } from 'react'
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
import { EditorSIdebar } from './EditorSIdebar/EditorSIdebar'
import { EditorUploads } from './EditorUploads/EditorUploads'
import { IoMdMenu } from 'react-icons/io'
import { CSSTransition } from 'react-transition-group'

interface IEditor {
  currentPage: string
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

const Editor: FC<IEditor> = ({ currentPage, virtualDom, setVirtualDom }) => {
  const active = useAppSelector((state) => state.codeEditor.active)
  const [switcher, setSwitcher] = useState('')
  const [isActiveSidebar, setIsActiveSidebar] = useState(false)
  const { inactiveCodeEditor } = userActions()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (active) {
      setSwitcher('Dashboard')
    }
  }, [active])

  const setWindowDimensions = () => {
    if (window.innerWidth >= 768) {
      setIsActiveSidebar(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', setWindowDimensions)
    return () => {
      window.removeEventListener('resize', setWindowDimensions)
    }
  }, [])

  const close = () => {
    inactiveCodeEditor()
    setSwitcher('')
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <CSSTransition in={active} timeout={500} appear={true} classNames='fade-apsa'>
      <div className={`${active ? '' : 'hidden'} fixed  inset-0 overflow-y-auto z-30 bg-inherit pt-[64px]`}>
        <div className='fixed top-0 left-0 right-0 z-10 bg-white dark:bg-slate-800 py-4 h-[64px] border-b border-slate-200 dark:border-slate-700'>
          <div className='max-w-[1280px] m-auto px-[15px] md:px-[30px] w-full flex items-center justify-between'>
            <div className='flex items-center justify-between'>
              <Button
                clName='btn-default !p-1 w-[34px] h-[34px] m-[2px] block md:hidden mr-2'
                onClick={() => setIsActiveSidebar(!isActiveSidebar)}
              >
                <IoMdMenu className='w-full  h-full' />
              </Button>
              <span className='font-bold'>APSA</span>
            </div>
            <div className='flex items-stretch space-x-2'>
              <ThemeToggle />
              <Select array={['ru', 'en']} setSelect={changeLanguage} defaultValue={i18n.language} />
              <Button
                clName={`btn-default flex items-center !p-1 md:!p-2 h-[34px] w-[34px] ${
                  i18n.language === 'ru' ? 'md:w-[80px]' : 'md:w-[70px]'
                }`}
                onClick={close}
              >
                <MdOutlineLogout className='w-full h-full md:h-[15px] md:-mt-[2px] md:mr-1' />
                <p className='hidden md:block'>{t('close')}</p>
              </Button>
            </div>
          </div>
        </div>
        <div className='max-w-[1280px] m-auto px-[15px] md:px-[30px]'>
          <div className='flex mt-10 mb-20'>
            <CSSTransition in={isActiveSidebar} timeout={5000} appear={true} classNames='fade-apsa'>
              <EditorSIdebar
                switcher={switcher}
                setSwitcher={setSwitcher}
                isActiveSidebar={isActiveSidebar}
                setIsActiveSidebar={setIsActiveSidebar}
              />
            </CSSTransition>
            <div className='editor-content flex flex-col flex-1 min-h-screen relative'>
              <div className='font-bold text-left text-4xl mb-10'>{t(switcher)}</div>
              {switcher === 'Dashboard' && (
                <CSSTransition in={switcher === 'Dashboard'} timeout={500} appear={true} classNames='fade-apsa'>
                  <Dashboard />
                </CSSTransition>
              )}
              {switcher === 'Images' && (
                <CSSTransition in={switcher === 'Images'} timeout={500} appear={true} classNames='fade-apsa'>
                  <EditorImages virtualDom={virtualDom} setVirtualDom={setVirtualDom} currentPage={currentPage} />
                </CSSTransition>
              )}
              {switcher === 'Text' && (
                <CSSTransition in={switcher === 'Text'} timeout={500} appear={true} classNames='fade-apsa'>
                  <EditorText virtualDom={virtualDom} setVirtualDom={setVirtualDom} currentPage={currentPage} />
                </CSSTransition>
              )}
              {switcher === 'Code' && (
                <CSSTransition in={switcher === 'Code'} timeout={500} appear={true} classNames='fade-apsa'>
                  <EditorCode virtualDom={virtualDom} currentPage={currentPage} setVirtualDom={setVirtualDom} />
                </CSSTransition>
              )}
              {switcher === 'Uploads' && (
                <CSSTransition in={switcher === 'Uploads'} timeout={500} appear={true} classNames='fade-apsa'>
                  <EditorUploads />
                </CSSTransition>
              )}

              <div className='flex items-center justify-center p-8 space-x-4 mt-auto'>
                <p>APSA</p>
                <a href='tg://resolve?domain=SidorovAlexander'>© Aleksandr Sidorov</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Editor
