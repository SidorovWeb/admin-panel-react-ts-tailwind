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
import { IBackupList } from './interface/backupList'
import { ModalEditorMeta } from './components/Modal/ModalEditorMeta'
import { pathAPI, pathHtml } from './Constants'
import { editorImages } from './components/Editor/EditorImages'
import { Login } from './components/Login/Login'
import { toast, ToastContainer } from 'react-toastify'
import { ModalLogout } from './components/Modal/ModalLogout'
import { IAuth } from './interface/auth'

export const App: FC = () => {
  const [pages, setPages] = useState([])
  const [backupList, setBackupList] = useState<IBackupList[]>([])
  const [currentPage, setCurrentPage] = useState('index.html')
  const [dom, setDom] = useState('')
  const [virtualDom, setVirtualDom] = useState<Document>()
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
    if (isAuth) {
      setLoading(true)
      const ls = JSON.parse(localStorage.getItem('apsw')!)
      ls ? setCurrentPage(ls.page) : null
      // getPageList()
    } else {
      return
    }
  }, [isAuth])

  useEffect(() => {
    if (isAuth) {
      const iframeDocument = document.querySelector('iframe')
      if (iframeDocument) {
        iframeDocument.setAttribute('src', `${pathHtml}${currentPage}`)
        axios
          .get(`${pathHtml}${currentPage}?rnd=${Math.random()}`) // ????
          .then((res) => parseStrDom(res.data))
          .then(wrapTextNodes)
          .then(wrapImages)
          .then((dom) => {
            setVirtualDom(dom)
            return dom
          })
          .then((dom) => serializeDOMToString(dom, setDom))
          .catch((e) => toast.error(e))
      }
    }
  }, [currentPage, isAuth])

  useEffect(() => {
    if (isAuth && virtualDom) {
      const iframeDocument = document.querySelector('iframe')
      if (iframeDocument) {
        saveTempPage(iframeDocument)
      }
    }
  }, [virtualDom, isAuth])

  const save = () => {
    setLoading(true)
    const newDom = virtualDom?.cloneNode(true)
    if (newDom) {
      unWrapTextNode(newDom)
      wrapImages(newDom)
      const html = serializeDOMToString(newDom, setDom)
      axios
        .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
        .then(() => {
          toast.success('Успешно сохранено!')
          getBackupList()
        })
        .catch((e) => toast.error(`Сохранить не удалось! ${e}`))
        .finally(() => setLoading(false))
    }
  }

  const saveTempPage = (iframeDocument: HTMLIFrameElement) => {
    const path = import.meta.env.MODE === 'development' ? '../api/' : './../'
    axios
      .post(`${pathAPI}saveTempPage.php`, { html: dom })
      .then(() => {
        iframeDocument.setAttribute('src', `${path}temporaryFileCanBeDeleted.html`)
        iframeDocument.onload = function () {
          enableEditing(iframeDocument)
          injectStyles(iframeDocument)
          const ls = JSON.parse(localStorage.getItem('apsw')!)
          if (ls && ls.backupTime) {
            toast.success(`Восстановлена резервная копия от ${ls.backupTime}`)
            delete ls['backupTime']
            localStorage.setItem('apsw', JSON.stringify({ ...ls }))
          }
          getPageList()
          getBackupList()
          setLoading(false)
          // deleteTampPage()
        }
      })
      .catch((e) => toast.error(e))
  }

  const getPageList = () => {
    axios
      .get<[]>(`${pathAPI}pageList.php`)
      .then((res) => {
        const filteredData = res.data.filter((item) => item !== 'temporaryFileCanBeDeleted.html')
        setPages(filteredData)
      })
      .catch((e) => toast.error(`Загрузить список страниц не удалось! ${e}`))
  }

  // const deleteTampPage = () => {
  //   axios
  //     .post(`${pathAPI}deleteTempPage.php`)
  //     .then((res) => {
  //       setLoading(false)
  //       getBackupList()
  //       console.log('3')
  //     })
  //     .catch((e) => toast.error(e))
  // }

  const enableEditing = (iframe: HTMLIFrameElement) => {
    iframe?.contentDocument?.body.querySelectorAll('.text-editor-app').forEach((el) => {
      if (virtualDom) {
        const htmlEl = el as HTMLElement
        editorText(htmlEl, virtualDom, setVirtualDom)
      }
    })

    iframe?.contentDocument?.body.querySelectorAll('.img-editor-app').forEach((el) => {
      if (virtualDom) {
        const htmlEl = el as HTMLImageElement
        editorImages(htmlEl, virtualDom, setVirtualDom, setLoading)
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
        .img-editor-app:hover {
          outline: 3px solid #fc0 !important;
          outline-offset: 0.5px !important;
        }
        `
      }

      iframe.contentDocument.head.appendChild(style)
    }
  }

  const getBackupList = () => {
    const path = import.meta.env.MODE === 'development' ? '../api/' : './api/'
    axios
      .get<IBackupList[]>(`${path}backups/backups.json`)
      .then((res) => {
        const list = res.data.filter((b) => b.page === currentPage)
        setBackupList(list)
      })
      .catch((err) => {
        axios.get<IBackupList[]>(`${pathAPI}backup.php`).catch(() => toast.error(`Загрузить backup не удалось! ${err}`))
      })
  }

  const restoreBackup = (e: MouseEvent, time: string, backup: string) => {
    e.preventDefault()
    setLoading(true)
    axios
      .post(`${pathAPI}restoreBackup.php`, { page: currentPage, file: backup })
      .then((res) => {
        const ls = JSON.parse(localStorage.getItem('apsw')!)
        localStorage.setItem('apsw', JSON.stringify({ ...ls, backupTime: time }))
        location.reload()
      })
      .catch((e) => toast.error(e))
      .catch((e) => toast.error(`Восстановить из backup не удалось! ${e}`))
  }

  return !isAuth ? (
    <>
      <Login />
    </>
  ) : (
    <>
      <iframe className='absolute top-0 left-0 w-full h-full border-0' id='idFrame' src=''></iframe>
      <Spinner active={loading} />
      <Panel />
      {virtualDom && <ModalEditorMeta virtualDom={virtualDom} save={save} currentPage={currentPage} />}
      <ModalConfirm save={save} />
      <ModalChoose pages={pages} setCurrentPage={setCurrentPage} />
      <ModalBackup list={backupList} restoreBackup={restoreBackup} />
      <ModalLogout />
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </>
  )
}
