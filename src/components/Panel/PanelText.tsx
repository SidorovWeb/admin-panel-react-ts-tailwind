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
import { PanelColor } from './PanelColor'

interface IPanelText {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const PanelText: FC<IPanelText> = ({ virtualDom, setVirtualDom }) => {
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
    '!p-1 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg w-[32px] h-[32px] m-[2px]'

  useEffect(() => {
    if (textId) {
      const textEl = iframe?.contentDocument?.body.querySelector(`[text-editor-app="${textId}"]`) as HTMLElement
      setCurrentEl(textEl)
      if (textEl?.parentElement) setParent(textEl.parentElement)
    }
  }, [textId])

  useEffect(() => {
    if (parent) {
      setAlignLeft(false)
      setAlignCenter(false)
      setAlignRight(false)
      setBold(false)
      setItalic(false)
      setUnderline(false)
      setLineThrough(false)
      setLower(false)
      setUpper(false)
      setStyleTextAlign()
      setStyleFontWeight()
      setStyleFontStyle()
      setStyleDecoration()
      setStyleTransform()
    }
  }, [parent])

  const removeProperty = (prop: string) => {
    const virtualElem = virtualDom?.body.querySelector(`[text-editor-app="${textId}"]`)?.parentElement as HTMLElement
    if (parent) {
      parent?.style.removeProperty(prop)
      virtualElem.style.removeProperty(prop)
      setVirtualDom(virtualDom)
    }
  }

  const setStyleTextAlign = () => {
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
  }

  const setStyleFontWeight = () => {
    if (parent?.style.fontWeight === 'bold') {
      setBold(true)
      if (bold) {
        setBold(false)
        removeProperty('font-weight')
      }
    }
  }

  const setStyleFontStyle = () => {
    if (parent?.style.fontStyle === 'italic') {
      setItalic(true)
      if (italic) {
        setItalic(false)
        removeProperty('font-style')
      }
    }
  }

  const setStyleDecoration = () => {
    if (parent?.style.textDecoration === 'underline') {
      setUnderline(true)
      setLineThrough(false)
      if (underline) {
        setUnderline(false)
        removeProperty('text-decoration')
      }
    }
    if (parent?.style.textDecoration === 'line-through') {
      setLineThrough(true)
      setUnderline(false)
      if (lineThrough) {
        setLineThrough(false)
        removeProperty('text-decoration')
      }
    }
  }

  const setStyleTransform = () => {
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
      currentEl.setAttribute('contentEditable', 'true')
      currentEl.focus()
    }
  }

  return (
    <div
      className='DragTextPanel panel-editor-text transition-opacity font-medium text-xs opacity-0 hidden'
      ref={panelEditorText}
    >
      <div className='DragTextPanel-top flex items-start'>
        <Button
          clName={`${alignLeft ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('text-align', 'left')
            setStyleTextAlign()
          }}
        >
          <MdFormatAlignLeft className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${alignCenter ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('text-align', 'center')
            setStyleTextAlign()
          }}
        >
          <MdFormatAlignJustify className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${alignRight ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('text-align', 'right')
            setStyleTextAlign()
          }}
        >
          <MdFormatAlignRight className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${bold ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('font-weight', 'bold')
            setStyleFontWeight()
          }}
        >
          <MdFormatBold className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${italic ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('font-style', 'italic')
            setStyleFontStyle()
          }}
        >
          <MdFormatItalic className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${underline ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('text-decoration', 'underline')
            setStyleDecoration()
          }}
        >
          <MdFormatUnderlined className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${lineThrough ? 'btn-primary' : 'btn-default'} ${cl}`}
          onClick={() => {
            setStyle('text-decoration', 'line-through')
            setStyleDecoration()
          }}
        >
          <MdStrikethroughS className='h-[24px] w-full' />
        </Button>
        <Button
          clName={`${upper ? 'btn-primary' : 'btn-default'} ${cl} uppercase`}
          onClick={() => {
            setStyle('text-transform', 'uppercase')
            setStyleTransform()
          }}
        >
          AA
        </Button>
        <Button
          clName={`${lower ? 'btn-primary' : 'btn-default'}  ${cl} lowercase`}
          onClick={() => {
            setStyle('text-transform', 'lowercase')
            setStyleTransform()
          }}
        >
          aa
        </Button>
        <Button clName={`btn-danger ${cl}`} onClick={closePanelEditorText}>
          <MdClose className='h-[20px] w-full' />
        </Button>
      </div>
      <PanelColor setStyle={setStyle} />
    </div>
  )
}
