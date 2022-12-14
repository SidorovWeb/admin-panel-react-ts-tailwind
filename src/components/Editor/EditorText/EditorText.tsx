import { FC, useEffect, useState } from 'react'
import { MdEdit, MdOutlineSearch } from 'react-icons/md'
import { parseStrDom } from '../../../helpers/dom-helpers'
import { toPublish } from '../../../helpers/utils'
import { userActions } from '../../../hooks/actions'
import { useAppSelector } from '../../../hooks/redux'
import { MiniSpinner } from '../../Spinners/MiniSpinner'
import { Tabs } from '../../UI/Tabs'
import { PublishedButton } from '../../UI/PublishedButton'
import { useTranslation } from 'react-i18next'
import { Search } from '../../UI/Search'

interface IEditorText {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  currentPage: string
}

interface IMapText {
  el: HTMLElement
  id: number
  tagName: string
  text: string
}

interface IFilterText {
  tagName?: string
  search?: string
}

export const EditorText: FC<IEditorText> = ({ virtualDom, setVirtualDom, currentPage }) => {
  const iframe = document.querySelector('iframe')
  const serializer = new XMLSerializer()
  const [textList, setTextList] = useState<IMapText[]>()
  const [filteredText, setFilteredText] = useState<IMapText[]>()
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState('all')
  const { setText } = userActions()
  const { text } = useAppSelector((state) => state.setText)
  const [oldText, setOldText] = useState('All')
  const [isSpinner, setIsSpinner] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    getTextNode()
    setIsSpinner(false)
  }, [])

  useEffect(() => {
    if (textList && mode.toLowerCase() === 'all') {
      setFilteredText(textList)
      return
    }

    filter({ tagName: mode })
    setSearch('')
  }, [textList, mode])

  useEffect(() => {
    if (text !== '' && text !== oldText) {
      getTextNode()
      filter({ search, tagName: mode })
    }
  }, [text])

  const getTextNode = () => {
    const textsNode = iframe?.contentDocument?.body.querySelectorAll(`.apsa-text`)
    const mapText =
      textsNode &&
      [...textsNode].map((t) => {
        const el = t as HTMLElement
        const id = Number(el.getAttribute('apsa-text'))
        const text = el.textContent as string
        let tagName = ''

        switch (el.parentElement?.tagName) {
          case 'TEXT-EDITOR':
            tagName = 'Text'
            break
          case 'BUTTON':
            tagName = 'Buttons'
            break
          case 'A':
            tagName = 'Links'
            break
          case 'H1':
            tagName = 'Headline'
          case 'H2':
            tagName = 'Headline'
          case 'H3':
            tagName = 'Headline'
          case 'H4':
            tagName = 'Headline'
          case 'H5':
            tagName = 'Headline'
          case 'H6':
            tagName = 'Headline'
            break
          default:
            tagName = 'Text'
            break
        }

        return {
          el,
          id: Number(id),
          text,
          tagName,
        }
      })

    setTextList(mapText)
  }

  const filter = ({ tagName, search }: IFilterText) => {
    if (tagName === '' || search === '') {
      if (mode === 'all') {
        setFilteredText(textList)
        return
      }

      filter({ tagName: mode })
      return
    }

    if (textList && tagName) {
      const filtered = textList.filter((text) => text.tagName.toLowerCase() === tagName.toLowerCase())
      setFilteredText(filtered)
    }

    if (textList && search) {
      const filtered = textList.filter((text) => {
        if (mode.toLowerCase() !== 'all') {
          return (
            text.text.toLowerCase().trim().includes(search.toLowerCase().trim()) &&
            text.tagName.toLowerCase() === mode.toLowerCase()
          )
        }

        return text.text.toLowerCase().trim().includes(search.toLowerCase().trim())
      })
      setFilteredText(filtered)
    }
  }

  const onSearch = (search: string) => {
    filter({ search })
    setSearch(search)
  }

  const editingText = (str: string, id: number) => {
    if (virtualDom) {
      setText({ id: id, text: str.trim(), element: 'text', selector: `[apsa-text="${id}"]` })
      setOldText(str.trim())
    }
  }

  const published = () => {
    const newHtml = serializer.serializeToString(virtualDom)
    const document = parseStrDom(newHtml)

    toPublish({ newVirtualDom: document, currentPage })
  }

  return (
    <div>
      <Tabs mode={mode} setMode={setMode} tabs={['All', 'Headline', 'Links', 'Buttons', 'Text']} />
      <div className='mb-3 relative w-full'>
        <MdOutlineSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6' />
        <Search value={search} onChange={onSearch} />
      </div>
      {isSpinner && <MiniSpinner />}
      <div className='flex flex-col'>
        <div className='sm:-mx-6 lg:-mx-8'>
          <div className='py-2 sm:px-6 lg:px-8'>
            <div className=''>
              <table className='table1 w-full'>
                <thead className='border-b border-slate-200 dark:border-slate-700'>
                  <tr className='flex text-left'>
                    <th scope='col' className='p-2 md:px-6 md:py-4'>
                      ID
                    </th>
                    <th scope='col' className='py-2 px-4 md:px-6 md:py-4 md:min-w-[110px]'>
                      Type
                    </th>
                    <th scope='col' className='py-2 md:px-6 md:py-4'>
                      Field
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!isSpinner &&
                    filteredText &&
                    filteredText.map((text) => (
                      <tr
                        className='border-b border-slate-200 dark:border-slate-700 transition-opacity duration-300 ease-in-out hover:opacity-50 flex items-start justify-start cursor-pointer md:p-4'
                        key={text.id}
                        onClick={() => editingText(text.text, text.id)}
                        data-bs-toggle='modal'
                        data-bs-target='#modalEditText'
                      >
                        <td className='p-2 min-w-[40px]'>{text.id}</td>
                        <td className='p-2 md:px-6 md:min-w-[110px]'>{text.tagName}</td>
                        <td className='p-2 md:px-6 font-medium flex'>
                          <MdEdit className='mt-1 mr-2 opacity-70' />
                          <p>{text.text}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!isSpinner && filteredText && !filteredText.length && (
                <div className='text-xl mt-6'>{t('textNotFound')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PublishedButton onClick={published} />
    </div>
  )
}
