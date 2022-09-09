import axios from 'axios'
import 'tw-elements'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { parseStrDom, serializeDOMToString, unWrapTextNode, wrapImages, wrapTextNodes } from './helpers/dom-helpers'
import { editorText } from './components/Editor/EditorText'
import 'react-toastify/dist/ReactToastify.css'
import { Spinner } from './components/Spinner/Spinner'
import { ModalConfirm } from './components/Modal/ModalConfirm'
import { ModalChoose } from './components/Modal/ModalChoose'
import { Panel } from './components/Panel/Panel'
import { ModalBackup } from './components/Modal/ModalBackup'
import { ModalEditorMeta } from './components/Modal/ModalEditorMeta'
import { pathAPI, pathHtml } from './Constants'
import { editorImages } from './components/Editor/EditorImages'
import { Login } from './components/Login/Login'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { ModalLogout } from './components/Modal/ModalLogout'
import { ControlPanelImg } from './components/Panel/ControlPanelImg'
import { IAuth } from './interface/auth'
import { ModalEditTextImg } from './components/Modal/ModalEditTextImg'
import { useVirtualDom } from './hooks/useVirtualDom'

export const App: FC = () => {
  const [currentPage, setCurrentPage] = useState('index.html')
  const [dom, setDom] = useState('')
  const [VD, setVDom] = useState<Document | null>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

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
          // setVDom(dom)
          setVDom(dom)
          return dom
        })
        .then((dom) => {
          return serializeDOMToString(dom, setDom)
        })
        .catch((e) => toast.error(e))
    }
  }, [currentPage, isAuth])

  useEffect(() => {
    if (isAuth && VD) {
      saveTempPage()
    }
  }, [VD, isAuth])

  const saveTempPage = () => {
    const path = import.meta.env.MODE === 'development' ? '../api/' : './../'
    axios
      .post(`${pathAPI}saveTempPage.php`, { html: dom })
      .then(() => {
        const iframeDocument = document.querySelector('iframe')
        if (iframeDocument) {
          iframeDocument.setAttribute('src', `${path}temporaryFileCanBeDeleted.html`)
          iframeDocument.onload = async function () {
            const ls = JSON.parse(localStorage.getItem('apsw')!)

            if (ls && ls.backupTime) {
              toast.success(`Восстановлена резервная копия от ${ls.backupTime}`)
              delete ls['backupTime']
              localStorage.setItem('apsw', JSON.stringify({ ...ls }))
            }

            setLoading(false)
            injectStyles(iframeDocument)
            enableEditing(iframeDocument)

            // deleteTampPage()
          }
        }
      })
      .catch((e) => toast.error(e))
  }

  // const deleteTampPage = () => {
  //   axios
  //     .post(`${pathAPI}deleteTempPage.php`)
  //     .then((res) => {
  //       setLoading(false)
  //       getBackupList()
  //       console.log('deleteTampPage')
  //     })
  //     .catch((e) => toast.error(e))
  // }

  const save = () => {
    setLoading(true)
    const newDom = VD?.cloneNode(true)
    if (newDom) {
      unWrapTextNode(newDom)
      wrapImages(newDom)
      const html = serializeDOMToString(newDom, setDom)

      axios
        .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
        .then(() => {
          toast.success('Успешно сохранено!')
          // getBackupList()
        })
        .catch((e) => toast.error(`Сохранить не удалось! ${e}`))
        .finally(() => setLoading(false))
    }
  }

  const enableEditing = (iframe: HTMLIFrameElement) => {
    iframe?.contentDocument?.body.querySelectorAll('.text-editor-app').forEach((el) => {
      if (VD) {
        const htmlEl = el as HTMLElement
        editorText(htmlEl, VD, setVDom)
      }
    })

    iframe?.contentDocument?.body.querySelectorAll('.img-editor-app').forEach((el) => {
      if (VD) {
        const htmlEl = el as HTMLImageElement
        editorImages(htmlEl, iframe)
      }
    })
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
          <Panel />
          {VD && <ControlPanelImg virtualDom={VD} setVirtualDom={setVDom} setLoading={setLoading} />}
        </>
      )}
      {VD && (
        <>
          <ModalEditorMeta virtualDom={VD} save={save} currentPage={currentPage} />
          <ModalBackup currentPage={currentPage} setLoading={setLoading} virtualDom={VD} setDom={setDom} />
          <ModalEditTextImg virtualDom={VD} setVirtualDom={setVDom} />
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
