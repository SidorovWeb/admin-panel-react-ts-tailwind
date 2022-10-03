import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
import Draggable, { DraggableData } from 'react-draggable'
import { Button } from '../UI/Button'
import {
  MdLogout,
  MdOutlineDragIndicator,
  MdOutlineEditNote,
  MdOutlineSync,
  MdPageview,
  MdSave,
  MdArchive,
  MdCode,
} from 'react-icons/md'
import { userActions } from '../../hooks/actions'

export const Panel: FC = () => {
  const dragContainer = useRef() as MutableRefObject<HTMLDivElement>
  const dragHandle = useRef() as MutableRefObject<HTMLButtonElement>
  const dragInner = useRef() as MutableRefObject<HTMLDivElement>
  const [posDraggable, setPosDraggable] = useState<any>()
  const { activateCodeEditor } = userActions()

  useEffect(() => {
    const position = JSON.parse(localStorage.getItem('apsw-draggable-position')!) as { x: number; y: number }
    const direction = JSON.parse(localStorage.getItem('apsw-draggable-direction')!) as string

    if (position) {
      setPosDraggable({ position: { x: position.x, y: position.y }, direction })
    } else {
      setPosDraggable({ position: { x: 20, y: 20 }, direction: `row` })
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
    let direction
    if (!dragContainer.current.classList.contains('draggable-flip_active')) {
      dragContainer.current.classList.add('draggable-flip_active')
      dragInner.current.style.flexDirection = 'column'
      direction = 'column'
    } else {
      dragContainer.current.classList.remove('draggable-flip_active')
      dragInner.current.style.flexDirection = 'row'
      direction = 'row'
    }

    localStorage.setItem('apsw-draggable-direction', JSON.stringify(direction))
  }

  const activatesCodeEditor = () => {
    activateCodeEditor()
  }

  return (
    <div className='DragIndicator__container' ref={dragContainer}>
      {posDraggable && (
        <Draggable
          handle='.DragHandle'
          defaultPosition={posDraggable.position}
          bounds='parent'
          onStart={handleStart}
          onStop={handleEnd}
        >
          <div
            className='fixed w-auto  z-998 bg-slate-700 bg-opacity-90 flex items-center rounded overflow-hidden shadow-md p-1'
            ref={dragInner}
            style={{
              flexDirection: posDraggable.direction,
            }}
          >
            <Button clName='btn-default !p-1 h-[38px]  m-[2px]' onClick={activatesCodeEditor}>
              <MdCode className='w-full h-[30px]' />
            </Button>
            <Button clName='btn-default !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalEditorMeta'>
              <MdOutlineEditNote className='w-full  h-[30px]' />
            </Button>
            <Button clName='btn-default !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalChoose'>
              <MdPageview className='w-full h-[30px]' />
            </Button>
            <Button clName='btn-default !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#confirmModal'>
              <MdSave className='w-full h-[30px]' />
            </Button>
            <Button clName='btn-default !p-1 h-[38px] m-[2px]' dataBsToggle dataBsTarget='#modalBackup'>
              <MdArchive className='w-full h-[30px] text-white' />
            </Button>
            <Button clName='btn-default !p-1 h-[38px]  m-[2px]' dataBsToggle dataBsTarget='#modalLogout'>
              <MdLogout className='w-full h-[30px]' />
            </Button>

            <button
              className=' hover:bg-slate-600 w-[38px]  m-[2px] h-[38px] p-1 active:hover:bg-slate-700  rounded'
              onClick={flipElement}
            >
              <MdOutlineSync className='w-full h-[24px] fill-slate-400 ' />
            </button>
            <button
              className='DragHandle w-[38px] h-[38px]  m-[2px] hover:bg-slate-600 p-1 active:hover:bg-slate-700  rounded'
              ref={dragHandle}
            >
              <MdOutlineDragIndicator className='w-full h-[24px] fill-slate-400' />
            </button>
          </div>
        </Draggable>
      )}
    </div>
  )
}
