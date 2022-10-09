import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
import Draggable, { DraggableData } from 'react-draggable'
import { Button } from '../UI/Button'
import { MdLogout, MdOutlineEditNote, MdOutlineSync, MdPageview, MdSave, MdArchive } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import { BiCodeAlt, BiMove } from 'react-icons/bi'
import { userActions } from '../../hooks/actions'
import { PanelEditorText } from './PanelEditorText'
import { useAppSelector } from '../../hooks/redux'

interface IPanel {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const Panel: FC<IPanel> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const dragContainer = useRef() as MutableRefObject<HTMLDivElement>
  const dragHandle = useRef() as MutableRefObject<HTMLButtonElement>
  const [posDraggable, setPosDraggable] = useState<any>()
  const { activateCodeEditor } = userActions()
  const textId = useAppSelector((state) => state.textEditorPanel.id)

  useEffect(() => {
    const position = JSON.parse(localStorage.getItem('apsw-draggable-position')!) as { x: number; y: number }
    const direction = JSON.parse(localStorage.getItem('apsw-draggable-direction')!) as string

    if (position) {
      setPosDraggable({ position: { x: position.x, y: position.y }, direction })
      dragContainer.current.classList.add(`DragContainer-${direction}`)
    } else {
      setPosDraggable({ position: { x: 20, y: 20 }, direction: `row` })
      dragContainer.current.classList.add(`DragContainer-row`)
    }
  }, [])

  const handleStart = () => {
    dragHandle.current.style.cursor = 'move'
    dragContainer.current.style.inset = '0'
    dragContainer.current.style.position = 'fixed'
  }

  const handleEnd = (_: any, data: DraggableData) => {
    dragHandle.current.style.cursor = 'pointer'
    dragContainer.current.style.inset = 'auto'
    dragContainer.current.style.position = 'static'

    const position = { x: data.x, y: data.y }
    localStorage.setItem('apsw-draggable-position', JSON.stringify(position))
  }

  const flipElement = () => {
    if (dragContainer.current.classList.contains('DragContainer-row')) {
      dragContainer.current.classList.remove(`DragContainer-row`)
      dragContainer.current.classList.add(`DragContainer-column`)
      localStorage.setItem('apsw-draggable-direction', JSON.stringify('column'))
    } else {
      dragContainer.current.classList.remove(`DragContainer-column`)
      dragContainer.current.classList.add(`DragContainer-row`)
      localStorage.setItem('apsw-draggable-direction', JSON.stringify('row'))
    }
  }

  const activatesCodeEditor = () => {
    activateCodeEditor()
  }

  const onclick = () => {
    const panelEditorText = document.querySelector('.panel-editor-text') as HTMLElement
    panelEditorText.style.display = 'flex'
    if (textId) {
      const textEl = iframe?.contentDocument?.body.querySelector(`[text-editor-app="${textId}"]`) as HTMLElement
      textEl.setAttribute('contentEditable', 'true')
      textEl.focus()
    }

    setTimeout(() => {
      panelEditorText.style.opacity = '1'
    }, 115)
  }

  return (
    <div ref={dragContainer}>
      {posDraggable && (
        <Draggable
          handle='.DragHandle'
          defaultPosition={posDraggable.position}
          bounds='parent'
          onStart={handleStart}
          onStop={handleEnd}
        >
          <div className='DragContainer fixed w-auto z-998 bg-slate-700/70 bg-opacity-90 rounded overflow-hidden shadow-md p-2 flex'>
            <div className='DragInner'>
              <div className='DragBlockPanel flex'>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' onClick={onclick}>
                  <AiFillEdit className='h-[24px] w-full' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' onClick={activatesCodeEditor}>
                  <BiCodeAlt className='w-full h-[30px]' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalEditorMeta'>
                  <MdOutlineEditNote className='w-full  h-[30px]' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalChoose'>
                  <MdPageview className='w-full h-[30px]' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#confirmModal'>
                  <MdSave className='w-full h-[30px]' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px] m-[2px]' dataBsToggle dataBsTarget='#modalBackup'>
                  <MdArchive className='w-full h-[30px] text-white' />
                </Button>
                <Button clName='btn-secondary !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalLogout'>
                  <MdLogout className='w-full h-[30px]' />
                </Button>
              </div>
              <PanelEditorText virtualDom={virtualDom} setVirtualDom={setVirtualDom} />
            </div>

            <button
              className='DragHandleFlip bg-gray-600 hover:bg-gray-700 w-[38px]  m-[2px] p-1 active:hover:bg-gray-800  rounded'
              onClick={flipElement}
            >
              <MdOutlineSync className='w-full h-[24px] fill-slate-400 ' />
            </button>
            <button
              className='DragHandle bg-gray-600 w-[38px] m-[2px] hover:bg-gray-700 p-1 active:hover:bg-gray-800  rounded'
              ref={dragHandle}
            >
              <BiMove className='w-full h-[24px] fill-slate-400 text-slate-400' />
            </button>
          </div>
        </Draggable>
      )}
    </div>
  )
}
