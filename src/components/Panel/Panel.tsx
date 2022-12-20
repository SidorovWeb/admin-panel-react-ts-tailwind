import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
import Draggable, { DraggableData } from 'react-draggable'
import { Button } from '../UI/Button'
import {
  MdOutlineEditNote,
  MdOutlineSync,
  MdImageSearch,
  MdOutlineLogout,
  MdOutlineBackup,
  MdOutlinePublishedWithChanges,
} from 'react-icons/md'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiMove } from 'react-icons/bi'
import { VscCode, VscGoToFile, VscSave } from 'react-icons/vsc'
import { userActions } from '../../hooks/actions'
import { PanelText } from './PanelText'
import { useAppSelector } from '../../hooks/redux'

interface IPanel {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const Panel: FC<IPanel> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const dragContainer = useRef() as MutableRefObject<HTMLDivElement>
  const dragHandle = useRef() as MutableRefObject<HTMLButtonElement>
  const dragPanel = useRef<HTMLDivElement>(null)
  const [posDraggable, setPosDraggable] = useState<any>()
  const { activateCodeEditor } = userActions()
  const textId = useAppSelector((state) => state.textEditorPanel.id)

  useEffect(() => {
    let position = JSON.parse(localStorage.getItem('apsa-draggable-position')!) as { x: number; y: number }
    let direction = JSON.parse(localStorage.getItem('apsa-draggable-direction')!) as string
    if (!direction) {
      direction = 'row'
    }

    if (position && direction === 'row' && position.x + 350 >= window.innerWidth) {
      setPosDraggable({ position: { x: 20, y: 20 }, direction: `row` })
      dragContainer.current.classList.add(`DragContainer-row`)
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
      localStorage.setItem('apsa-draggable-position', JSON.stringify({ x: 20, y: 20 }))
      return
    }
    if (position && direction === 'column' && position.y + 350 >= window.innerHeight) {
      console.log(position, window.innerHeight)

      setPosDraggable({ position: { x: 20, y: 20 }, direction: `row` })
      dragContainer.current.classList.add(`DragContainer-row`)
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
      localStorage.setItem('apsa-draggable-position', JSON.stringify({ x: 20, y: 20 }))
      return
    }

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
    localStorage.setItem('apsa-draggable-position', JSON.stringify(position))
    // const co = document.querySelector('.DragContainer') as HTMLElement
    // console.log('handleEnd', position.x + co.offsetWidth)
  }

  const flipElement = () => {
    if (dragContainer.current.classList.contains('DragContainer-row')) {
      dragContainer.current.classList.remove(`DragContainer-row`)
      dragContainer.current.classList.add(`DragContainer-column`)
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('column'))
    } else {
      dragContainer.current.classList.remove(`DragContainer-column`)
      dragContainer.current.classList.add(`DragContainer-row`)
      localStorage.setItem('apsa-draggable-direction', JSON.stringify('row'))
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
      if (textEl) {
        textEl.setAttribute('contentEditable', 'true')
        textEl.focus()
      }
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
          <div
            className='DragContainer fixed w-auto z-998 bg-slate-700/70 bg-opacity-90 rounded overflow-hidden shadow-md p-2 flex'
            ref={dragPanel}
          >
            <div className='DragInner'>
              <div className='DragBlockPanel flex'>
                <Button clName='btn-default !p-1 w-[34px] h-[34px] m-[2px]' onClick={onclick}>
                  <AiOutlineEdit className='w-full h-full' />
                </Button>
                <Button clName='btn-default !p-1 w-[34px] h-[34px] m-[2px]' onClick={activatesCodeEditor}>
                  <VscCode className='w-full h-full' />
                </Button>
                <Button
                  clName='btn-default !p-1 w-[34px] h-[34px] m-[2px]'
                  dataBsToggle
                  dataBsTarget='#modalEditorMeta'
                >
                  <MdOutlineEditNote className='w-full  h-full' />
                </Button>
                <Button clName='btn-default !p-1 w-[34px] h-[34px] m-[2px]' dataBsToggle dataBsTarget='#modalChoose'>
                  <VscGoToFile className='w-full h-full' />
                </Button>

                <Button clName='btn-default !p-1 w-[34px] h-[34px] m-[2px]' dataBsToggle dataBsTarget='#modalBackup'>
                  <MdOutlineBackup className='w-full h-full text-white' />
                </Button>
                <Button clName='btn-success !p-1 w-[34px] h-[34px] m-[2px]' dataBsToggle dataBsTarget='#confirmModal'>
                  <MdOutlinePublishedWithChanges className='w-full h-full' />
                </Button>
                <Button clName='btn-danger !p-1 w-[34px] h-[34px] m-[2px]' dataBsToggle dataBsTarget='#modalLogout'>
                  <MdOutlineLogout className='w-full h-full' />
                </Button>
              </div>
              <PanelText virtualDom={virtualDom} setVirtualDom={setVirtualDom} />
            </div>

            <button className='DragHandleFlip btn-default w-[34px] m-[2px] p-1 rounded' onClick={flipElement}>
              <MdOutlineSync className='w-full h-full' />
            </button>
            <button className='DragHandle btn-default w-[34px] m-[2px] p-1 rounded' ref={dragHandle}>
              <BiMove className='w-full h-full' />
            </button>
          </div>
        </Draggable>
      )}
    </div>
  )
}
