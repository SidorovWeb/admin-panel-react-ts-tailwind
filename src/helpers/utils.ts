import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../constants'
import { serializeDOMToString, unWrapImages, unWrapTextNode } from './dom-helpers'

interface IToPublish {
  newVirtualDom: Document
  currentPage: string
  publicationConfirmation?: boolean
}

export const toPublish = ({ newVirtualDom, currentPage }: IToPublish) => {
  unWrapTextNode(newVirtualDom)
  unWrapImages(newVirtualDom)
  const html = serializeDOMToString(newVirtualDom)

  axios
    .post(`${pathAPI}savePage.php`, { pageName: currentPage, html })
    .then(() => {
      toast.success('Successfully published!')
    })
    .catch((e) => toast.error(`Failed to save! ${e}`))
}

export const rect = (el: HTMLElement) => {
  const top = el.getBoundingClientRect().top + document.documentElement.scrollTop
  const left = el.getBoundingClientRect().left
  const height = el.getBoundingClientRect().height
  const width = el.getBoundingClientRect().width

  return { top, left, height, width }
}

export const imageSize = (image: File) => {
  return new Promise<{ width: number; height: number; size: number }>((resolve, reject) => {
    try {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const img = new Image()
        const size = Math.round(image.size / 1024)

        img.onload = () => {
          resolve({ width: img.width, height: img.height, size })
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
