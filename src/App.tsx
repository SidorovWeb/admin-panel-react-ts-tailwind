import axios from 'axios'
import 'tw-elements'
import { FC, lazy, Suspense, useEffect, useState } from 'react'
import {
    parseStrDom,
    serializeDOMToString,
    wrapImages,
    wrapTextNodes,
} from './helpers/dom-helpers'
import 'react-toastify/dist/ReactToastify.css'
import { Panel } from './components/Panel/Panel'
import { Login } from './components/Login/Login'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { userActions } from './hooks/actions'
import { pathHtml } from './constants'
import { CSSTransition } from 'react-transition-group'
import {
    checkAuth,
    getBackupList,
    getListCssFiles,
    getListHtmlFiles,
    getListJsFiles,
} from './services'
import { enableEditing, injectStyles, saveTempPage } from './helpers/utils'
const Editor = lazy(() => import('./components/Editor/Editor'))
const ModalWindows = lazy(() => import('./components/Modal/ModalWindows'))

export interface IAuth {
    auth: boolean
}

export const App: FC = () => {
    const [iframe, setIframe] = useState<HTMLIFrameElement>()
    const [currentPage, setCurrentPage] = useState('index.html')
    const [virtualDom, setVirtualDom] = useState<Document | null>()
    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const { getImages } = userActions()
    const { getHtmlFiles, getCssFiles, getJsFiles, getBackupFiles } =
        userActions()

    const appWrap =
        'bg-white dark:bg-slate-800 text-gray-700 dark:text-white font-light'

    useEffect(() => {
        window.ondrop = (e) => {
            e.preventDefault()
        }

        if (JSON.parse(localStorage.getItem('apsa-themes')!) === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            localStorage.setItem('apsa-themes', JSON.stringify('light'))
            document.documentElement.classList.remove('dark')
        }

        if (import.meta.env.MODE === 'development') {
            setIsAuth(true)
        } else {
            checkAuth().then((res: any) => {
                setIsAuth(res.auth)
            })
        }
    }, [])

    useEffect(() => {
        if (currentPage) {
            setLoading(true)
            const ls = JSON.parse(localStorage.getItem('apsa')!)
            if (ls && ls.page) {
                setCurrentPage(ls.page)
            }
        }

        if (isAuth) {
            axios
                .get(`${pathHtml}${currentPage}?rnd=${Math.random()}`)
                .then((res) => parseStrDom(res.data))
                .then(wrapTextNodes)
                .then(wrapImages)
                .then((dom) => {
                    const images = [...dom.body.querySelectorAll('img')] as []

                    getImages({ images })
                    setVirtualDom(dom)
                    return dom
                })
                .then((dom) => {
                    const serializeDOM = serializeDOMToString(dom)
                    saveTempPage(serializeDOM, setLoading, setIframe)
                })
                .catch((e) => toast.error(e))
        }

        return
    }, [currentPage, isAuth])

    useEffect(() => {
        if (virtualDom && iframe && !loading) {
            injectStyles(iframe)
            enableEditing(iframe, virtualDom, setVirtualDom, currentPage)
        }
    }, [loading])

    useEffect(() => {
        getListHtmlFiles().then((htmlFiles) =>
            getHtmlFiles({ htmlFiles: htmlFiles || [] })
        )

        getListCssFiles().then((cssFiles) =>
            getCssFiles({
                cssFiles: cssFiles || {
                    files: [],
                    path: [],
                },
            })
        )

        getListJsFiles().then((jsFiles) =>
            getJsFiles({
                jsFiles: jsFiles || {
                    files: [],
                    path: [],
                },
            })
        )

        getBackupList().then((backupFiles) =>
            getBackupFiles({ backupFiles: backupFiles || [] })
        )
    }, [])

    if (!isAuth) {
        return (
            <div className={appWrap}>
                <Login setIsAuth={setIsAuth} />
            </div>
        )
    }

    return (
        <div className={appWrap}>
            <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                id="idFrame"
                src=""
            ></iframe>
            {!loading && virtualDom && (
                <CSSTransition
                    in={!loading}
                    timeout={300}
                    appear={true}
                    classNames="fade-apsa"
                >
                    <div className="bg-white dark:bg-slate-800">
                        <Panel
                            virtualDom={virtualDom}
                            setVirtualDom={setVirtualDom}
                        />
                        <Suspense fallback={<></>}>
                            <Editor
                                virtualDom={virtualDom}
                                setVirtualDom={setVirtualDom}
                                currentPage={currentPage}
                            />
                            <ModalWindows
                                virtualDom={virtualDom}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </Suspense>

                        <ToastContainer
                            position="top-right"
                            autoClose={8000}
                            newestOnTop={false}
                            hideProgressBar
                            closeOnClick
                            rtl={false}
                            draggable
                            transition={Slide}
                            className="toast-message"
                            theme="colored"
                        />
                    </div>
                </CSSTransition>
            )}
        </div>
    )
}
