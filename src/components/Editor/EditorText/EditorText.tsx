import { FC, useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { parseStrDom } from '../../../helpers/dom-helpers'
import { toPublish } from '../../../helpers/utils'
import { userActions } from '../../../hooks/actions'
import { useAppSelector } from '../../../hooks/redux'
import { MiniSpinner } from '../../Spinners/MiniSpinner'
import { Tabs } from '../../Tabs/Tabs'
import { PublishedButton } from '../../UI/PublishedButton'

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
  const [mode, setMode] = useState('All')
  const { setText } = userActions()
  const { text } = useAppSelector((state) => state.setText)
  const [oldText, setOldText] = useState('All')
  const [isSpinner, setIsSpinner] = useState(true)

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
    const textsNode = iframe?.contentDocument?.body.querySelectorAll(`.text-editor-app`)
    const mapText =
      textsNode &&
      [...textsNode].map((t) => {
        const el = t as HTMLElement
        const id = Number(el.getAttribute('text-editor-app'))
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
      setText({ id: id, text: str.trim(), element: 'text', selector: `[text-editor-app="${id}"]` })
      setOldText(str.trim())
    }
  }

  const published = () => {
    const newHtml = serializer.serializeToString(virtualDom)
    const document = parseStrDom(newHtml)

    toPublish({ newVirtualDom: document, currentPage })
  }

  return (
    <>
      <Tabs mode={mode} setMode={setMode} tabs={['All', 'Headline', 'Links', 'Buttons', 'Text']} />
      <div className='mb-3 relative w-full'>
        <MdOutlineSearch className='absolute top-[50%] left-2 translate-y-[-50%] opacity-[0.4] w-6 h-6' />
        <input
          type='search'
          className='form-control block w-full px-10 py-1.5 mx-0 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-6 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          id='exampleSearch'
          placeholder='Имя изображения'
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {isSpinner && <MiniSpinner active={isSpinner} />}
      <div className='flex flex-col'>
        <div className='sm:-mx-6 lg:-mx-8'>
          <div className='py-2 sm:px-6 lg:px-8'>
            <div>
              <table className='table1'>
                <thead className='bg-white border-b'>
                  <tr className='flex text-left'>
                    <th scope='col' className='text-gray-900 px-6 py-4'>
                      ID
                    </th>
                    <th scope='col' className='text-gray-900 px-6 py-4 min-w-[110px]'>
                      Type
                    </th>
                    <th scope='col' className='text-gray-900 px-6 py-4'>
                      Field
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!isSpinner &&
                    filteredText &&
                    filteredText.map((text) => (
                      <tr
                        className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 flex items-start justify-start cursor-pointer p-4'
                        key={text.id}
                        onClick={() => editingText(text.text, text.id)}
                        data-bs-toggle='modal'
                        data-bs-target='#modalEditText'
                      >
                        <td className='text-gray-900 font-light min-w-[40px]'>{text.id}</td>
                        <td className='text-gray-900 font-light px-6 min-w-[110px]'>{text.tagName}</td>
                        <td className='text-gray-900 font-light px-6 '>{text.text}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <PublishedButton onClick={published} />
    </>
  )
}
