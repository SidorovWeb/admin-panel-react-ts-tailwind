import { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/redux'
import { EditorCode } from './EditorCode'
import { EditorImages } from './EditorImages'
import { EditorText } from './EditorText'
import { useTranslation } from 'react-i18next'
import { EditorSIdebar } from './EditorSIdebar'
import { EditorUploads } from './EditorUploads'
import { CSSTransition } from 'react-transition-group'
import { Dashboard } from './EditorDashboard'
import EditorTop from './EditorTop'
import EditorMaps from './EditorMaps'
import EditorVideo from './EditorVideo'
import EditorManual from './EditorManual'

interface IEditor {
    currentPage: string
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
}

const Editor: FC<IEditor> = ({ currentPage, virtualDom, setVirtualDom }) => {
    const active = useAppSelector((state) => state.codeEditor.active)
    const [switcher, setSwitcher] = useState('')
    const [isActiveSidebar, setIsActiveSidebar] = useState(false)
    const { t } = useTranslation()
    const components = [
        { name: 'Dashboard', component: <Dashboard /> },
        {
            name: 'Images',
            component: (
                <EditorImages
                    virtualDom={virtualDom}
                    setVirtualDom={setVirtualDom}
                    currentPage={currentPage}
                />
            ),
        },
        { name: 'Text', component: <EditorText virtualDom={virtualDom} /> },
        {
            name: 'Code',
            component: (
                <EditorCode
                    virtualDom={virtualDom}
                    currentPage={currentPage}
                    setVirtualDom={setVirtualDom}
                />
            ),
        },
        {
            name: 'Maps',
            component: (
                <EditorMaps virtualDom={virtualDom} currentPage={currentPage} />
            ),
        },
        {
            name: 'Video',
            component: (
                <EditorVideo
                    virtualDom={virtualDom}
                    currentPage={currentPage}
                />
            ),
        },
        { name: 'Uploads', component: <EditorUploads /> },
        { name: 'Manual', component: <EditorManual /> },
    ]

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

    return (
        <CSSTransition
            in={active}
            timeout={300}
            appear={true}
            classNames="fade-apsa"
        >
            <div
                className={`${
                    active ? '' : 'hidden'
                } fixed  inset-0 overflow-y-auto z-30 bg-inherit pt-[64px]`}
            >
                <EditorTop
                    setSwitcher={setSwitcher}
                    isActiveSidebar={isActiveSidebar}
                    setIsActiveSidebar={setIsActiveSidebar}
                />
                <div className="max-w-[1280px] m-auto px-[15px] min-h-full">
                    <div className="flex mt-10">
                        <EditorSIdebar
                            switcher={switcher}
                            setSwitcher={setSwitcher}
                            isActiveSidebar={isActiveSidebar}
                            setIsActiveSidebar={setIsActiveSidebar}
                        />
                        <div className="editor-content flex flex-col flex-1 relative">
                            <div className="font-bold text-left text-4xl mb-10">
                                {t(switcher)}
                            </div>

                            {components.map((item) => (
                                <div
                                    key={item.name}
                                    className={`${
                                        switcher === item.name ? 'open' : 'hide'
                                    }`}
                                >
                                    {item.component}
                                </div>
                            ))}

                            <div className="flex items-center justify-center p-8 space-x-4 mt-auto">
                                <p>APSA</p>
                                <a
                                    href="tg://resolve?domain=SidorovAlexander"
                                    className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 transition-all"
                                >
                                    © Aleksandr Sidorov
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Editor
