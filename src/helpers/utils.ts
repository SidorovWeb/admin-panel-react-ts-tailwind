import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../constants'
import {
    parseStrDom,
    serializeDOMToString,
    unWrapImages,
    unWrapTextNode,
} from './dom-helpers'
import { processingText } from './text'
import { processingImages } from './images'
import { Dispatch, SetStateAction } from 'react'
const serializer = new XMLSerializer()

interface IToPublish {
    newVirtualDom: Document
    currentPage: string
    publicationConfirmation?: boolean
}

export const published = (virtualDom: Document, currentPage: string) => {
    const newHtml = serializer.serializeToString(virtualDom)
    const document = parseStrDom(newHtml)

    toPublish({ newVirtualDom: document, currentPage })
}

export const toPublish = ({ newVirtualDom, currentPage }: IToPublish) => {
    unWrapTextNode(newVirtualDom)
    unWrapImages(newVirtualDom)
    const html = serializeDOMToString(newVirtualDom)

    axios
        .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
        .catch((e) => toast.error(`Failed to save! ${e}`))
}

export const rect = (el: HTMLElement) => {
    const top =
        el.getBoundingClientRect().top + document.documentElement.scrollTop
    const left = el.getBoundingClientRect().left
    const height = el.getBoundingClientRect().height
    const width = el.getBoundingClientRect().width

    return { top, left, height, width }
}

export const imageSize = (image: File) => {
    return new Promise<{
        width: number
        height: number
        size: number
        extension: string
    }>((resolve, reject) => {
        try {
            const fileReader = new FileReader()

            fileReader.onload = () => {
                const img = new Image()
                const size = Math.round(image.size / 1024)

                const parts = image.name.split('.')
                const extension = parts[parts.length - 1]
                img.onload = () => {
                    resolve({
                        width: img.width,
                        height: img.height,
                        size,
                        extension,
                    })
                }

                img.src = fileReader.result as any
            }

            fileReader.readAsDataURL(image)
        } catch (e) {
            reject(e)
        }
    })
}

export const convertBytes = function (bytes: number) {
    const sizes = ['Kb', 'Mb', 'Gb', 'Tb']

    if (bytes == 0) {
        return 'n/a'
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    if (i == 0) {
        return bytes + ' ' + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

export const injectStyles = (iframe: HTMLIFrameElement) => {
    if (iframe && iframe.contentDocument) {
        const style = iframe.contentDocument.createElement('style')
        if (style) {
            style.innerHTML = `
    .apsa-text:hover {
      outline: 3px solid #fc0 !important;
      outline-offset: 0.5px !important;
      cursor: text !important;
    }
    .apsa-text:focus {
      outline: 3px solid green !important;
      outline-offset: 0.5px !important;
      cursor: text !important;
    }
    `
        }

        iframe.contentDocument.head.appendChild(style)
    }
}

export const enableEditing = (
    iframe: HTMLIFrameElement,
    virtualDom: Document,
    setVirtualDom: Dispatch<SetStateAction<Document | null | undefined>>,
    currentPage: string
) => {
    if (virtualDom) {
        iframe?.contentDocument?.body
            .querySelectorAll('.apsa-text')
            .forEach((el) => {
                const htmlEl = el as HTMLElement
                processingText(htmlEl, virtualDom, setVirtualDom)
            })

        iframe?.contentDocument?.body
            .querySelectorAll('.apsa-img')
            .forEach((el) => {
                const imgIframe = el as HTMLImageElement
                processingImages({
                    img: imgIframe,
                    virtualDom,
                    setVirtualDom,
                    currentPage,
                })
            })
    }
}

export const saveTempPage = async (
    htmlDom: string,
    setLoading: (is: boolean) => void,
    setIframe: (document: HTMLIFrameElement) => void
) => {
    const path = import.meta.env.MODE === 'development' ? '../api/' : './../'
    await axios
        .post(`${pathAPI}saveTempPage.php`, { html: htmlDom })
        .then(() => {
            const iframeDocument = document.querySelector('iframe')
            if (iframeDocument) {
                iframeDocument.setAttribute(
                    'src',
                    `${path}temporaryFileCanBeDeleted.html`
                )
                iframeDocument.onload = function () {
                    setLoading(false)
                    setIframe(iframeDocument)
                    iframeDocument.contentDocument?.body.setAttribute(
                        'oncontextmenu',
                        'return false;'
                    )
                }
            }
        })
        .catch((e) => toast.error(e))
}
