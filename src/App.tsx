import axios from 'axios'
import 'tw-elements'
import { FC, useEffect, useState } from 'react'
import { parseStrDom, serializeDOMToString, wrapImages, wrapTextNodes } from './helpers/dom-helpers'
import { processingText } from './helpers/Text'
import 'react-toastify/dist/ReactToastify.css'
import { OnFullScreen } from './components/Spinners/OnFullScreen'
import { Panel } from './components/Panel/Panel'
import { pathAPI, pathHtml } from './Constants'
import { processingImages } from './helpers/Images'
import { Login } from './components/Login/Login'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { PanelImage } from './components/Panel/PanelImage'
import { IAuth } from './interface/auth'
import { Editor } from './components/Editor/Editor'
import { ModalWindows } from './components/Modal/ModalWindows'

export const App: FC = () => {
  const [iframe, setIframe] = useState<HTMLIFrameElement>()
  const [currentPage, setCurrentPage] = useState('index.html')
  const [virtualDom, setVirtualDom] = useState<Document | null>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

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
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsAuth(true)
  }
  // const checkAuth = () => {
  //   axios
  //     .get<IAuth>(`${pathAPI}checkAuth.php`)
  //     .then((res) => {
  //       setIsAuth(res.data.auth)
  //     })
  //     .catch((e) => toast.error(e))
  // }

  useEffect(() => {
    if (currentPage) {
      setLoading(true)
      const ls = JSON.parse(localStorage.getItem('apsa')!)
      if (ls && ls.page) {
        setCurrentPage(ls.page)
      }
    } else {
      return
    }
  }, [currentPage])

  useEffect(() => {
    if (isAuth) {
      axios
        .get(`${pathHtml}${currentPage}?rnd=${Math.random()}`)
        .then((res) => parseStrDom(res.data))
        .then(wrapTextNodes)
        .then(wrapImages)
        .then((dom) => {
          setVirtualDom(dom)
          return dom
        })
        .then((dom) => {
          const serializeDOM = serializeDOMToString(dom)
          saveTempPage(serializeDOM)
        })
        .catch((e) => toast.error(e))
    }
  }, [currentPage, isAuth])

  useEffect(() => {
    if (virtualDom && loading === false && iframe) {
      injectStyles(iframe)
      enableEditing(iframe)
    }
  }, [virtualDom, loading])

  const saveTempPage = (htmlDom: string) => {
    setVirtualDom(parseStrDom(htmlDom))
    const path = import.meta.env.MODE === 'development' ? '../api/' : './../'
    axios
      .post(`${pathAPI}saveTempPage.php`, { html: htmlDom })
      .then(() => {
        const iframeDocument = document.querySelector('iframe')
        if (iframeDocument) {
          iframeDocument.setAttribute('src', `${path}temporaryFileCanBeDeleted.html`)
          iframeDocument.onload = async function () {
            setLoading(false)
            setIframe(iframeDocument)
          }
        }
      })
      .catch((e) => toast.error(e))
  }

  const enableEditing = (iframe: HTMLIFrameElement) => {
    if (virtualDom) {
      iframe?.contentDocument?.body.querySelectorAll('.text-editor-app').forEach((el) => {
        const htmlEl = el as HTMLElement
        processingText(htmlEl, virtualDom, setVirtualDom)
      })

      iframe?.contentDocument?.body.querySelectorAll('.img-editor-app').forEach((el) => {
        const htmlEl = el as HTMLImageElement
        processingImages({ el: htmlEl, iframe })
      })
    }
  }

  const injectStyles = (iframe: HTMLIFrameElement) => {
    if (iframe && iframe.contentDocument) {
      const style = iframe.contentDocument.createElement('style')
      if (style) {
        style.innerHTML = `
        .text-editor-app:hover {
          outline: 3px solid #fc0 !important;
          outline-offset: 0.5px !important;
        }
        .text-editor-app:focus {
          outline: 3px solid green !important;
          outline-offset: 0.5px !important;
        }
        :any-link .text-editor-app:hover {
          outline: 3px solid red !important;
          outline-offset: 0.5px !important;
        }
        :any-link .text-editor-app:focus {
          outline: 3px solid green !important;
          outline-offset: 0.5px !important;
        }
        `
      }

      iframe.contentDocument.head.appendChild(style)
    }
  }

  return (
    <div className='bg-white dark:bg-slate-800 text-gray-700 dark:text-white font-light'>
      {!isAuth ? (
        <Login setIsAuth={setIsAuth} />
      ) : (
        <>
          <iframe className='absolute top-0 left-0 w-full h-full border-0' id='idFrame' src=''></iframe>
          {!loading && virtualDom ? (
            <>
              <Panel virtualDom={virtualDom} setVirtualDom={setVirtualDom} />
              <PanelImage virtualDom={virtualDom} setVirtualDom={setVirtualDom} />
              <Editor virtualDom={virtualDom} setVirtualDom={setVirtualDom} currentPage={currentPage} />
              <ModalWindows
                virtualDom={virtualDom}
                setVirtualDom={setVirtualDom}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              <ToastContainer
                position='top-center'
                autoClose={4000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable={false}
                pauseOnHover={true}
                transition={Slide}
              />
            </>
          ) : (
            <OnFullScreen />
          )}
        </>
      )}
    </div>
  )
}
