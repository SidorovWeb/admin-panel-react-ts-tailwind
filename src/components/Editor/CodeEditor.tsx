import { FC, useCallback, useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { CodeEditorTabs } from './CodeEditorTabs'
import { CodeSelect } from './CodeSelect'
import { Button } from '../UI/Button'
import { toast } from 'react-toastify'
import axios from 'axios'
import { pathAPI } from '../../Constants'
import { useAppSelector } from '../../hooks/redux'
import { userActions } from '../../hooks/actions'
import { rect } from '../../helpers/utils'

interface IPropsByMode {
  mode: string
  value: string
  extensions: any
}

interface ICodeEditor {
  currentPage: string
  saveTempPage: (dom: string, dd?: any) => void
  VirtualDom: Document
  save: () => void
}
interface IFiles {
  files: string[]
  path: string[]
}

export const CodeEditor: FC<ICodeEditor> = ({ VirtualDom, currentPage, saveTempPage, save }) => {
  const active = useAppSelector((state) => state.codeEditor.active)
  const { inactiveCodeEditor } = userActions()
  const codeEditor = useRef<HTMLDivElement>(null)
  const codeEditorTop = useRef<HTMLDivElement>(null)
  const codeEditorBottom = useRef<HTMLDivElement>(null)
  const [codeEditorHeight, setCodeEditorHeight] = useState(0)
  const [data, setData] = useState('')
  const [mode, setMode] = useState('html')

  const themes = ['dark', 'light']
  const [theme, setTheme] = useState() as any

  const [cssFiles, setCssFiles] = useState<IFiles>()
  const [cssFileName, setCssFileName] = useState('')
  const [cssData, setCssData] = useState('')

  const [jsFiles, setJsFiles] = useState<IFiles>()
  const [jsFileName, setJsFileName] = useState('')
  const [jsData, setJsData] = useState('')

  const [propsByMode, setPropsByMode] = useState<IPropsByMode>()

  const getList = async (nameFile: string, setFun: (v: any) => void) => {
    return await axios
      .get<[]>(`${pathAPI}${nameFile}`)
      .then((res) => {
        let files = [] as string[]

        res.data.forEach((f: string) => {
          const fileName = f.split('/').pop()
          if (fileName) files.push(fileName)
        })
        setFun({ files, path: res.data })
      })
      .catch((e) => toast.error(`Загрузить список страниц не удалось! ${e}`))
  }

  useEffect(() => {
    if (active) {
      if (codeEditor.current) {
        codeEditor.current.style.display = 'block'

        setTimeout(() => {
          codeEditor.current?.classList.add('show')
        }, 115)

        calculatesHeightCodeEditor()
      }
    }
  }, [active])

  const calculatesHeightCodeEditor = () => {
    if (codeEditorBottom.current && codeEditorTop.current) {
      const h = window.innerHeight - (rect(codeEditorTop.current).height + rect(codeEditorBottom.current).height)
      const newH = h > 500 ? h : 500

      setCodeEditorHeight(newH)
    }
  }

  const resizeHandler = () => {
    calculatesHeightCodeEditor()
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    getList('cssList.php', setCssFiles)
    getList('jsList.php', setJsFiles)
  }, [])

  const getContentFile = (file: IFiles | undefined, fileName: string, setFun: (v: any) => void) => {
    if (file) {
      const idx = file.files.indexOf(fileName) !== -1 ? file.files.indexOf(fileName) : 0

      axios.post(`${pathAPI}getContentFile.php`, { filename: file?.path[idx] }).then((res) => {
        setFun(res.data)
      })
    }
  }

  useEffect(() => {
    if (mode === 'css') getContentFile(cssFiles, cssFileName, setCssData)
    if (mode === 'js') getContentFile(jsFiles, jsFileName, setJsData)
  }, [mode, cssFileName, jsFileName])

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('apsw-theme')!)

    if (theme) {
      setTheme(theme)
    } else {
      setTheme('dark')
    }

    switch (mode) {
      case 'html':
        const serializer = new XMLSerializer()
        setPropsByMode({
          mode: 'html',
          value: serializer.serializeToString(VirtualDom),
          extensions: html({ autoCloseTags: true, matchClosingTags: true }),
        })
        break
      case 'css':
        setPropsByMode({
          mode: 'css',
          value: cssData,
          extensions: css(),
        })
        break
      case 'js':
        setPropsByMode({
          mode: 'javascript',
          value: jsData,
          extensions: javascript({ jsx: true }),
        })
        break
      default:
        break
    }
  }, [mode, cssData, jsData])

  const onChange = useCallback((value: string) => {
    setData(value)
  }, [])

  const savesCode = () => {
    switch (mode) {
      case 'html':
        saveTempPage(data)

        axios
          .post(`${pathAPI}savePage.php`, { pageName: currentPage, html: data })
          .then(() => {
            setTimeout(() => {
              toast.success(`Успешно опубликовано`)
            }, 500)
          })
          .catch((e) => toast.error(`Опубликовать не удалось! ${e}`))

        break
      case 'js':
        const idxJs = jsFiles?.files.indexOf(jsFileName) !== -1 ? jsFiles?.files.indexOf(jsFileName) : 0
        axios
          .post(`${pathAPI}saveFile.php`, { pathToFile: jsFiles?.path[idxJs ?? 0], data: data })
          .then((res) => {
            setTimeout(() => {
              toast.success(`Успешно опубликовано`)
            }, 500)
          })
          .catch((e) => toast.error(`Опубликовать не удалось! ${e}`))
        break
      case 'css':
        const idxCss = cssFiles?.files.indexOf(cssFileName) !== -1 ? cssFiles?.files.indexOf(cssFileName) : 0
        axios
          .post(`${pathAPI}saveFile.php`, { pathToFile: cssFiles?.path[idxCss ?? 0], data: data })
          .then((res) => {
            setTimeout(() => {
              toast.success(`Успешно опубликовано`)
            }, 500)
          })
          .catch((e) => toast.error(`Опубликовать не удалось! ${e}`))
        break
    }
  }

  const close = () => {
    codeEditor.current?.classList.remove('show')
    setTimeout(() => {
      if (codeEditor.current) codeEditor.current.style.display = 'none'
      inactiveCodeEditor()
    }, 115)
  }

  return (
    <div ref={codeEditor} className='fade hidden codeEditor fixed inset-0 overflow-y-auto z-30 bg-white'>
      <div className='px-4 pt-6' ref={codeEditorTop}>
        <div className='font-bold text-left text-xl mb-2'>Редактор кода</div>
        <CodeEditorTabs mode={mode} setMode={setMode} />
        <div className='pb-4 flex justify-between items-center space-x-2'>
          <>
            {propsByMode && propsByMode.mode === 'html' && <div className='font-bold mr-auto'>{currentPage}</div>}
            {propsByMode && propsByMode.mode === 'css' && cssFiles?.files && (
              <div className='font-bold mr-auto'>
                <CodeSelect array={cssFiles.files} setSelect={setCssFileName} />
              </div>
            )}
            {propsByMode && propsByMode.mode === 'javascript' && jsFiles?.files && (
              <div className='font-bold mr-auto'>
                <CodeSelect array={jsFiles.files} setSelect={setJsFileName} />
              </div>
            )}
          </>
          <div className='font-bold mr-auto'>
            <CodeSelect array={themes} setSelect={setTheme} theme={theme} />
          </div>
        </div>
      </div>

      {active && (
        <div className='px-4'>
          <div className='rounded overflow-hidden'>
            <CodeMirror
              height={`${codeEditorHeight}px`}
              value={propsByMode && propsByMode.value}
              theme={theme}
              extensions={[propsByMode && propsByMode.extensions]}
              onChange={onChange}
            />
          </div>
        </div>
      )}

      <div className='fixed bottom-0 right-4 px-4 py-5 space-x-4 flex items-center justify-end' ref={codeEditorBottom}>
        <Button clName='btn-secondary' onClick={close}>
          Закрыть
        </Button>
        <Button clName='btn-success text-base h-auto' onClick={savesCode}>
          Опубликовать
        </Button>
      </div>
    </div>
  )
}
