import { FC, useEffect, useRef, useState } from 'react'
import {
  MdClose,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
} from 'react-icons/md'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../UI/Button'

interface IPanelEditorText {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const PanelEditorText: FC<IPanelEditorText> = ({ virtualDom, setVirtualDom }) => {
  const [currentEl, setCurrentEl] = useState<HTMLElement>()
  const [parent, setParent] = useState<HTMLElement>()

  const textId = useAppSelector((state) => state.textEditorPanel.id)
  const iframe = document.querySelector('iframe')
  const panelEditorText = useRef<HTMLDivElement>(null)

  const [alignLeft, setAlignLeft] = useState(false)
  const [alignCenter, setAlignCenter] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const [lower, setLower] = useState(false)
  const [upper, setUpper] = useState(false)
  const [bold, setBold] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [lineThrough, setLineThrough] = useState(false)
  const [italic, setItalic] = useState(false)

  const cl =
    '!p-1 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg min-w-[28px] m-[2px]'

  useEffect(() => {
    if (textId) {
      const textEl = iframe?.contentDocument?.body.querySelector(`[text-editor-app="${textId}"]`) as HTMLElement
      setCurrentEl(textEl)
      if (textEl.parentElement) setParent(textEl.parentElement)
    }
  }, [textId])

  useEffect(() => {
    setAlignLeft(false)
    setAlignCenter(false)
    setAlignRight(false)
    setBold(false)
    setItalic(false)
    setUnderline(false)
    setLineThrough(false)
    setLower(false)
    setUpper(false)

    isProperties()
  }, [parent])

  const removeProperty = (prop: string) => {
    const virtualElem = virtualDom?.body.querySelector(`[text-editor-app="${textId}"]`)?.parentElement as HTMLElement
    parent?.style.removeProperty(prop)
    virtualElem.style.removeProperty(prop)
    setVirtualDom(virtualDom)
  }

  const isProperties = () => {
    if (parent?.style.textAlign === 'left') {
      setAlignLeft(true)
      setAlignRight(false)
      setAlignCenter(false)

      if (alignLeft) {
        setAlignLeft(false)
        removeProperty('text-align')
      }
    }
    if (parent?.style.textAlign === 'center') {
      setAlignLeft(false)
      setAlignCenter(true)
      setAlignRight(false)

      if (alignCenter) {
        setAlignCenter(false)
        removeProperty('text-align')
      }
    }
    if (parent?.style.textAlign === 'right') {
      setAlignLeft(false)
      setAlignCenter(false)
      setAlignRight(true)

      if (alignRight) {
        setAlignRight(false)
        removeProperty('text-align')
      }
    }
    if (parent?.style.fontWeight === 'bold') {
      setBold(true)
      if (bold) {
        setBold(false)
        removeProperty('font-weight')
      }
    }
    if (parent?.style.fontStyle === 'italic') {
      setItalic(true)
      if (italic) {
        setItalic(false)
        removeProperty('font-style')
      }
    }
    if (parent?.style.textDecoration === 'underline') {
      setUnderline(true)
      if (underline) {
        setUnderline(false)
        removeProperty('text-decoration')
      }
    }
    if (parent?.style.textDecoration === 'line-through') {
      setLineThrough(true)
      if (lineThrough) {
        setLineThrough(false)
        removeProperty('text-decoration')
      }
    }
    if (parent?.style.textTransform === 'lowercase') {
      setLower(true)
      setUpper(false)
      if (lower) {
        setLower(false)
        removeProperty('text-transform')
      }
    }
    if (parent?.style.textTransform === 'uppercase') {
      setLower(false)
      setUpper(true)
      if (upper) {
        setUpper(false)
        removeProperty('text-transform')
      }
    }
  }

  const closePanelEditorText = () => {
    if (panelEditorText.current) panelEditorText.current.style.opacity = '0'
    if (currentEl) {
      currentEl.setAttribute('contentEditable', 'true')
      currentEl.focus()
    }

    setTimeout(() => {
      if (panelEditorText.current) panelEditorText.current.style.display = 'none'
    }, 115)
  }

  const setStyle = (properties: string, value: string) => {
    if (currentEl?.parentElement) {
      const virtualElem = virtualDom?.body.querySelector(`[text-editor-app="${textId}"]`)?.parentElement as HTMLElement
      parent?.style.setProperty(properties, value)
      virtualElem.style.setProperty(properties, value)
      setVirtualDom(virtualDom)

      isProperties()

      currentEl.setAttribute('contentEditable', 'true')
      currentEl.focus()
    }
  }

  return (
    <div
      className='DragTextPanel panel-editor-text transition-opacity font-medium text-xs leading-tight opacity-0 hidden'
      ref={panelEditorText}
    >
      <Button
        clName={`${alignLeft ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('text-align', 'left')}
      >
        <MdFormatAlignLeft className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${alignCenter ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('text-align', 'center')}
      >
        <MdFormatAlignJustify className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${alignRight ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('text-align', 'right')}
      >
        <MdFormatAlignRight className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${bold ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('font-weight', 'bold')}
      >
        <MdFormatBold className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${italic ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('font-style', 'italic')}
      >
        <MdFormatItalic className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${underline ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('text-decoration', 'underline')}
      >
        <MdFormatUnderlined className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${lineThrough ? 'btn-primary' : 'btn-secondary'} ${cl}`}
        onClick={() => setStyle('text-decoration', 'line-through')}
      >
        <MdStrikethroughS className='h-[24px] w-full' />
      </Button>
      <Button
        clName={`${upper ? 'btn-primary' : 'btn-secondary'} ${cl} uppercase`}
        onClick={() => setStyle('text-transform', 'uppercase')}
      >
        AA
      </Button>
      <Button
        clName={`${lower ? 'btn-primary' : 'btn-secondary'}  ${cl} lowercase`}
        onClick={() => setStyle('text-transform', 'lowercase')}
      >
        aa
      </Button>
      <Button clName={`btn-danger ${cl}`} onClick={closePanelEditorText}>
        <MdClose className='h-[20px] w-full' />
      </Button>
    </div>
  )
}
