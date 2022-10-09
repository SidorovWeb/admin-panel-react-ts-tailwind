import axios from 'axios'
import 'tw-elements'
import { FC, useEffect, useState } from 'react'
import { parseStrDom, serializeDOMToString, unWrapTextNode, wrapImages, wrapTextNodes } from './helpers/dom-helpers'
import { processingText } from './helpers/Text'
import 'react-toastify/dist/ReactToastify.css'
import { Spinner } from './components/Spinner/Spinner'
import { ModalConfirm } from './components/Modal/ModalConfirm'
import { ModalChoose } from './components/Modal/ModalChoose'
import { Panel } from './components/Panel/Panel'
import { ModalBackup } from './components/Modal/ModalBackup'
import { ModalEditorMeta } from './components/Modal/ModalEditorMeta'
import { pathAPI, pathHtml } from './Constants'
import { processingImages } from './helpers/Images'
import { Login } from './components/Login/Login'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { ModalLogout } from './components/Modal/ModalLogout'
import { ControlPanelImg } from './components/Panel/ControlPanelImg'
import { IAuth } from './interface/auth'
import { ModalEditTextImg } from './components/Modal/ModalEditTextImg'
import { CodeEditor } from './components/Editor/CodeEditor'

export const App: FC = () => {
  const [iframe, setIframe] = useState<HTMLIFrameElement>()
  const [currentPage, setCurrentPage] = useState('index.html')
  const [VD, setVDom] = useState<Document | null>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  window.ondrop = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
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
      const ls = JSON.parse(localStorage.getItem('apsw')!)
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
          setVDom(dom)
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
    if (VD && loading === false && iframe) {
      injectStyles(iframe)
      enableEditing(iframe)
    }
  }, [VD, loading])

  const saveTempPage = (htmlDom: string) => {
    setVDom(parseStrDom(htmlDom))
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

  const save = () => {
    setLoading(true)
    const newDom = VD?.cloneNode(true)

    if (newDom) {
      unWrapTextNode(newDom)
      wrapImages(newDom)
      const html = serializeDOMToString(newDom)

      axios
        .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
        .then(() => {
          toast.success('Успешно опубликовано!')
        })
        .catch((e) => toast.error(`Сохранить не удалось! ${e}`))
        .finally(() => setLoading(false))
    }
  }

  const enableEditing = (iframe: HTMLIFrameElement) => {
    if (VD) {
      iframe?.contentDocument?.body.querySelectorAll('.text-editor-app').forEach((el) => {
        const htmlEl = el as HTMLElement
        processingText(htmlEl, VD, setVDom)
      })

      iframe?.contentDocument?.body.querySelectorAll('.img-editor-app').forEach((el) => {
        const htmlEl = el as HTMLImageElement
        processingImages(htmlEl, iframe)
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
        `
      }

      iframe.contentDocument.head.appendChild(style)
      iframe?.contentDocument?.body.querySelectorAll('.img-editor-app').forEach((el) => {
        const htmlEl = el as HTMLImageElement
        processingImages(htmlEl, iframe)
      })
    }
  }

  return !isAuth ? (
    <>
      <Login setIsAuth={setIsAuth} />
    </>
  ) : (
    <>
      <Spinner active={loading} />
      <iframe className='absolute top-0 left-0 w-full h-full border-0' id='idFrame' src=''></iframe>
      {!loading && (
        <>
          {VD && (
            <>
              <Panel virtualDom={VD} setVirtualDom={setVDom} />
              <ControlPanelImg virtualDom={VD} setVirtualDom={setVDom} setLoading={setLoading} />
            </>
          )}
        </>
      )}
      {VD && (
        <>
          <ModalEditorMeta virtualDom={VD} save={save} currentPage={currentPage} />
          <ModalBackup />
          <ModalEditTextImg virtualDom={VD} setVirtualDom={setVDom} />
          <CodeEditor VirtualDom={VD} saveTempPage={saveTempPage} currentPage={currentPage} save={save} />
        </>
      )}
      <ModalChoose setCurrentPage={setCurrentPage} />
      <ModalConfirm save={save} />
      <ModalLogout />
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        transition={Slide}
      />
    </>
  )
}
