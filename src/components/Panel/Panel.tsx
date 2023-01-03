import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
import Draggable, { DraggableData } from 'react-draggable'
import { Button } from '../UI/Button'
import {
  MdOutlineEditNote,
  MdOutlineSync,
  MdOutlineLogout,
  MdOutlineBackup,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiMove } from 'react-icons/bi'
import { VscCode, VscGoToFile, VscSave } from 'react-icons/vsc'
import { userActions } from '../../hooks/actions'
import { PanelTextEditing } from './PanelTextEditing'
import { useAppSelector } from '../../hooks/redux'

interface IPanel {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const Panel: FC<IPanel> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const dragContainerWrap = useRef() as MutableRefObject<HTMLDivElement>
  const dragHandle = useRef() as MutableRefObject<HTMLButtonElement>
  const [posDraggable, setPosDraggable] = useState<any>()
  const [panelEditorText, setPanelEditorText] = useState(false)
  const [direction, setDirection] = useState('row')
  const textId = useAppSelector((state) => state.textEditorPanel.id)
  const { activateCodeEditor } = userActions()
  const clBtn = '!p-1 w-[30px] md:w-[34px] h-[30px] md:h-[34px] m-[2px]'

  useEffect(() => {
    let position = JSON.parse(localStorage.getItem('apsa-draggable-position')!) as { x: number; y: number }
    let direction = JSON.parse(localStorage.getItem('apsa-draggable-direction')!) as string
    if (!direction) {
      direction = 'row'
    }

    if (position && direction === 'row' && position.x + 350 >= window.innerWidth) {
      setPosDraggable({ position: { x: 0, y: 0 }, direction: `row` })
      setDirection('row')
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
      localStorage.setItem('apsa-draggable-position', JSON.stringify({ x: 0, y: 0 }))
      return
    }
    if (position && direction === 'column' && position.y + 350 >= window.innerHeight) {
      setPosDraggable({ position: { x: 0, y: 0 }, direction: `row` })
      setDirection('row')
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
      localStorage.setItem('apsa-draggable-position', JSON.stringify({ x: 0, y: 0 }))
      return
    }

    if (position) {
      setPosDraggable({ position: { x: position.x, y: position.y }, direction })
      setDirection(direction)
    } else {
      setPosDraggable({ position: { x: 0, y: 0 }, direction: `row` })
      setDirection(direction)
    }
  }, [])

  const handleStart = () => {
    dragHandle.current.style.cursor = 'move'
    dragContainerWrap.current.style.inset = '0'
    dragContainerWrap.current.style.position = 'fixed'
  }

  const handleEnd = (_: any, data: DraggableData) => {
    dragHandle.current.style.cursor = 'pointer'
    dragContainerWrap.current.style.inset = 'auto'
    dragContainerWrap.current.style.position = 'static'

    const position = { x: data.x, y: data.y }
    localStorage.setItem('apsa-draggable-position', JSON.stringify(position))
  }

  const flipElement = () => {
    if (direction === 'row') {
      setDirection('column')
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('column'))
    } else {
      setDirection('row')
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
    }
  }

  const activatesCodeEditor = () => {
    activateCodeEditor()
  }

  const callingTextEditingPanel = () => {
    if (textId) {
      const textEl = iframe?.contentDocument?.body.querySelector(`[text-editor-app="${textId}"]`) as HTMLElement
      if (textEl) {
        textEl.setAttribute('contentEditable', 'true')
        textEl.focus()
      }
    }
    setPanelEditorText(!panelEditorText)
  }

  const onMouseEnter = () => {
    let btnsEditorImg = document.querySelector('.btns-editor-img') as HTMLElement
    if (!btnsEditorImg) {
      return
    }
    btnsEditorImg.style.opacity = '0'
  }

  return (
    <div ref={dragContainerWrap} className={`${direction === 'row' ? 'DragContainer-row' : 'DragContainer-column'}`}>
      {posDraggable && (
        <Draggable
          handle='.DragHandle'
          defaultPosition={posDraggable.position}
          bounds='parent'
          onStart={handleStart}
          onStop={handleEnd}
        >
          <div
            className='DragContainer fixed w-auto z-999 bg-slate-300/90 dark:bg-slate-800/90 rounded overflow-hidden shadow-lg p-1.5 flex flex-wrap'
            onMouseEnter={onMouseEnter}
          >
            <div className='DragInner'>
              <div className='DragBlockPanel flex'>
                <Button
                  clName={`${panelEditorText ? '!bg-slate-800' : ''} ${clBtn} btn-default md:`}
                  onClick={callingTextEditingPanel}
                >
                  <AiOutlineEdit className='w-full h-full' />
                </Button>
                <Button
                  clName={`${clBtn} btn-default`}
                  onClick={() => {
                    activatesCodeEditor()
                    setPanelEditorText(false)
                  }}
                >
                  <VscCode className='w-full h-full' />
                </Button>
                <Button
                  clName={`${clBtn} btn-default`}
                  dataBsToggle
                  dataBsTarget='#modalEditorMeta'
                  onClick={() => setPanelEditorText(false)}
                >
                  <MdOutlineEditNote className='w-full  h-full' />
                </Button>
                <Button
                  clName={`${clBtn} btn-default`}
                  dataBsToggle
                  dataBsTarget='#modalChoose'
                  onClick={() => setPanelEditorText(false)}
                >
                  <VscGoToFile className='w-full h-full' />
                </Button>

                <Button
                  clName={`${clBtn} btn-default`}
                  dataBsToggle
                  dataBsTarget='#modalBackup'
                  onClick={() => setPanelEditorText(false)}
                >
                  <MdOutlineBackup className='w-full h-full text-white' />
                </Button>
                <Button
                  clName={`${clBtn} btn-success`}
                  dataBsToggle
                  dataBsTarget='#confirmModal'
                  onClick={() => setPanelEditorText(false)}
                >
                  <MdOutlinePublishedWithChanges className='w-full h-full' />
                </Button>
                <Button
                  clName={`${clBtn} btn-danger`}
                  dataBsToggle
                  dataBsTarget='#modalLogout'
                  onClick={() => setPanelEditorText(false)}
                >
                  <MdOutlineLogout className='w-full h-full' />
                </Button>
              </div>
              <PanelTextEditing
                virtualDom={virtualDom}
                setVirtualDom={setVirtualDom}
                active={panelEditorText}
                close={setPanelEditorText}
              />
            </div>
            <Button clName={`${clBtn} btn-default DragHandleFlip rounded md:ml-2`} onClick={flipElement}>
              <MdOutlineSync className='w-full h-full' />
            </Button>
            <button className={`${clBtn} btn-default DragHandle rounded`} ref={dragHandle}>
              <BiMove className='w-full h-full' />
            </button>
          </div>
        </Draggable>
      )}
    </div>
  )
}
