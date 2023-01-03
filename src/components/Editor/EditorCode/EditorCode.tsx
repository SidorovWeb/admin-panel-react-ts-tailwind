import { FC, useCallback, useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { Tabs } from '../../Tabs/Tabs'
import { Select } from '../../UI/Select'
import { toast } from 'react-toastify'
import axios from 'axios'
import { pathAPI } from '../../../Constants'
import { parseStrDom } from '../../../helpers/dom-helpers'
import { toPublish } from '../../../helpers/utils'
import { PublishedButton } from '../../UI/PublishedButton'
import { MiniSpinner } from '../../Spinners/MiniSpinner'
import { useTranslation } from 'react-i18next'

interface IPropsByMode {
  mode: string
  value: string
  extensions: any
}

interface IEditorCode {
  currentPage: string
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}
interface IFiles {
  files: string[]
  path: string[]
}

export const EditorCode: FC<IEditorCode> = ({ virtualDom, setVirtualDom, currentPage }) => {
  const serializer = new XMLSerializer()
  const codeMirrorWrapperRef = useRef<HTMLDivElement>(null)
  const [codeMirrorWidth, setCodeMirrorWidth] = useState<number>()
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
  const [isSpinner, setIsSpinner] = useState(true)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('apsa-theme-editor')!)

    if (theme) {
      setTheme(theme)
    } else {
      setTheme('dark')
    }

    calculatesHeightCodeEditor()
    setIsSpinner(false)
    getList('cssList.php', setCssFiles)
    getList('jsList.php', setJsFiles)
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    if (mode === 'css') getContentFile(cssFiles, cssFileName, setCssData)
    if (mode === 'js') getContentFile(jsFiles, jsFileName, setJsData)
  }, [mode, cssFileName, jsFileName])

  useEffect(() => {
    switch (mode) {
      case 'html':
        setPropsByMode({
          mode: 'html',
          value: serializer.serializeToString(virtualDom),
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
      .catch((e) => toast.error(`Failed to load list of pages! ${e}`))
  }

  const calculatesHeightCodeEditor = () => {
    const width = codeMirrorWrapperRef && codeMirrorWrapperRef.current?.offsetWidth
    if (width) setCodeMirrorWidth(width)
  }

  const resizeHandler = () => {
    calculatesHeightCodeEditor()
  }

  const getContentFile = (file: IFiles | undefined, fileName: string, setFun: (v: any) => void) => {
    if (file) {
      const idx = file.files.indexOf(fileName) !== -1 ? file.files.indexOf(fileName) : 0

      axios.post(`${pathAPI}getContentFile.php`, { filename: file?.path[idx] }).then((res) => {
        setFun(res.data)
      })
    }
  }

  const onChange = (value: string) => {
    setData(value)
  }

  const overwriteFile = (files: IFiles, fileName: string) => {
    const idxCss = files?.files.indexOf(fileName) !== -1 ? files?.files.indexOf(fileName) : 0
    axios
      .post(`${pathAPI}saveFile.php`, { pathToFile: files?.path[idxCss ?? 0], data: data })
      .then(() => {
        if (i18n.language === 'ru') {
          toast.success('Успешно опубликовано!')
        } else {
          toast.success('Successfully published!')
        }
      })
      .catch((e) => toast.error(`Publish failed! ${e}`))
  }

  const published = async () => {
    switch (mode) {
      case 'html':
        const newHtml = data ? data : serializer.serializeToString(virtualDom)
        await axios.post(`${pathAPI}saveTempPage.php`, { html: newHtml })

        const document = parseStrDom(newHtml)
        setVirtualDom(document)
        toPublish({ newVirtualDom: document, currentPage })
        break
      case 'js':
        if (jsFiles) {
          overwriteFile(jsFiles, jsFileName)
        }
        break
      case 'css':
        if (cssFiles) {
          overwriteFile(cssFiles, cssFileName)
        }
        break
    }
  }

  const setThemes = (theme: string) => {
    localStorage.setItem('apsa-theme-editor', JSON.stringify(theme))
    setTheme(theme)
  }

  return (
    <>
      <Tabs mode={mode} setMode={setMode} tabs={['HTML', 'CSS', 'JS']} />

      <div className='pb-4 flex justify-between items-center space-x-2'>
        <>
          {propsByMode && propsByMode.mode === 'html' && <div className='font-medium mr-auto'>{currentPage}</div>}
          {propsByMode && propsByMode.mode === 'css' && cssFiles?.files && (
            <div className='font-medium mr-auto'>
              <Select array={cssFiles.files} setSelect={setCssFileName} />
            </div>
          )}
          {propsByMode && propsByMode.mode === 'javascript' && jsFiles?.files && (
            <div className='font-medium mr-auto'>
              <Select array={jsFiles.files} setSelect={setJsFileName} />
            </div>
          )}
        </>
        <div className='font-medium mr-auto'>
          <Select array={themes} setSelect={setThemes} defaultValue={theme} />
        </div>
      </div>
      {isSpinner && <MiniSpinner />}
      {!isSpinner && (
        <>
          <div className='rounded relative w-full h-full' ref={codeMirrorWrapperRef}>
            <CodeMirror
              height='100%'
              basicSetup={{
                foldGutter: false,
              }}
              className='absolute inset-0 w-full h-full'
              width={`${codeMirrorWidth}px`}
              value={propsByMode && propsByMode.value}
              theme={theme}
              extensions={[propsByMode && propsByMode.extensions]}
              onChange={onChange}
            />
          </div>
          <PublishedButton onClick={published} />
        </>
      )}
    </>
  )
}
