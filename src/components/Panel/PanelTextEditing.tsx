import { FC, useEffect, useRef, useState } from 'react'
import {
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
import { PanelEffects } from './PanelEffects'

interface IPanelTextEditing {
    virtualDom: Document
    setVirtualDom: (dom: Document) => void
    active: boolean
    close: (isActive: boolean) => void
}

export const PanelTextEditing: FC<IPanelTextEditing> = ({
    virtualDom,
    setVirtualDom,
    active,
    close,
}) => {
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
        '!p-1 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg  w-[30px] md:w-[34px] h-[30px] md:h-[34px] m-[2px] '

    useEffect(() => {
        if (textId) {
            const textEl = iframe?.contentDocument?.body.querySelector(
                `[apsa-text="${textId}"]`
            ) as HTMLElement
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
        const virtualElem = virtualDom?.body.querySelector(
            `[apsa-text="${textId}"]`
        )?.parentElement as HTMLElement
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

    const setStyle = (properties: string, value: string) => {
        if (currentEl?.parentElement) {
            const virtualElem = virtualDom?.body.querySelector(
                `[apsa-text="${textId}"]`
            )?.parentElement as HTMLElement
            parent?.style.setProperty(properties, value)
            virtualElem.style.setProperty(properties, value)
            setVirtualDom(virtualDom)
            currentEl.setAttribute('contentEditable', 'true')
        }
    }

    return (
        <div
            className={`${
                active ? 'block opacity-1' : 'hidden opacity-0'
            } DragTextPanel panel-editor-text transition-all font-medium text-xs`}
            ref={panelEditorText}
        >
            <div className="DragTextPanel-top flex items-start">
                <Button
                    clName={`${
                        alignLeft ? 'btn-primary' : 'btn-default'
                    } ${cl}`}
                    onClick={() => {
                        setStyle('text-align', 'left')
                        setStyleTextAlign()
                    }}
                >
                    <MdFormatAlignLeft className="h-full w-full" />
                </Button>
                <Button
                    clName={`${
                        alignCenter ? 'btn-primary' : 'btn-default'
                    } ${cl}`}
                    onClick={() => {
                        setStyle('text-align', 'center')
                        setStyleTextAlign()
                    }}
                >
                    <MdFormatAlignJustify className="h-full w-full" />
                </Button>
                <Button
                    clName={`${
                        alignRight ? 'btn-primary' : 'btn-default'
                    } ${cl}`}
                    onClick={() => {
                        setStyle('text-align', 'right')
                        setStyleTextAlign()
                    }}
                >
                    <MdFormatAlignRight className="h-full w-full" />
                </Button>
                <Button
                    clName={`${bold ? 'btn-primary' : 'btn-default'} ${cl}`}
                    onClick={() => {
                        setStyle('font-weight', 'bold')
                        setStyleFontWeight()
                    }}
                >
                    <MdFormatBold className="h-full w-full" />
                </Button>
                <Button
                    clName={`${italic ? 'btn-primary' : 'btn-default'} ${cl}`}
                    onClick={() => {
                        setStyle('font-style', 'italic')
                        setStyleFontStyle()
                    }}
                >
                    <MdFormatItalic className="h-full w-full" />
                </Button>
                <Button
                    clName={`${
                        underline ? 'btn-primary' : 'btn-default'
                    } ${cl}`}
                    onClick={() => {
                        setStyle('text-decoration', 'underline')
                        setStyleDecoration()
                    }}
                >
                    <MdFormatUnderlined className="h-full w-full" />
                </Button>
                <Button
                    clName={`${
                        lineThrough ? 'btn-primary' : 'btn-default'
                    } ${cl}`}
                    onClick={() => {
                        setStyle('text-decoration', 'line-through')
                        setStyleDecoration()
                    }}
                >
                    <MdStrikethroughS className="h-full w-full" />
                </Button>
                <Button
                    clName={`${
                        upper ? 'btn-primary' : 'btn-default'
                    } ${cl} uppercase font-bold`}
                    onClick={() => {
                        setStyle('text-transform', 'uppercase')
                        setStyleTransform()
                    }}
                >
                    AA
                </Button>
                <Button
                    clName={`${
                        lower ? 'btn-primary' : 'btn-default'
                    }  ${cl} lowercase font-bold`}
                    onClick={() => {
                        setStyle('text-transform', 'lowercase')
                        setStyleTransform()
                    }}
                >
                    aa
                </Button>
            </div>
            <PanelEffects setStyle={setStyle} />
        </div>
    )
}
