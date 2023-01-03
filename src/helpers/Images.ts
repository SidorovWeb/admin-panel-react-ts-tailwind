import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../Constants'
import { rect } from './utils'

interface iProcessingImages {
  el: HTMLImageElement
  iframe: HTMLIFrameElement
}

export const processingImages = ({ el, iframe }: iProcessingImages) => {
  const parent = el.parentNode as HTMLElement
  const id = el.getAttribute('img-editor-app')
  let btnsEditorImg = document.querySelector('.btns-editor-img') as HTMLElement

  const setsStyleBtnUploadImg = () => {
    const widthBtnsEditorImg = btnsEditorImg.getBoundingClientRect().width
    const right = 10

    btnsEditorImg.setAttribute('img-editor-id', `${id}`)
    btnsEditorImg.style.top = `${rect(parent).top + rect(parent).height / 2}px`
    btnsEditorImg.style.left = `${rect(parent).left + rect(parent).width - widthBtnsEditorImg - right}px`
    btnsEditorImg.style.transform = `translateY(-50%)`
    btnsEditorImg.style.opacity = '1'
  }

  // parent.addEventListener('mousemove', (e) => {
  //   if (!btnsEditorImg) btnsEditorImg = document.querySelector('.btns-editor-img') as HTMLElement
  //   return
  // })

  parent.addEventListener('mousemove', (e) => {
    if (!btnsEditorImg) {
      btnsEditorImg = document.querySelector('.btns-editor-img') as HTMLElement
      return
    }

    if (btnsEditorImg) {
      btnsEditorImg.style.opacity = '1'
      btnsEditorImg.style.pointerEvents = 'auto'

      setsStyleBtnUploadImg()
    }
  })

  iframe.contentDocument?.addEventListener('scroll', () => {
    if (btnsEditorImg) btnsEditorImg.style.opacity = '0'
  })
}

interface IUploadImage {
  img: HTMLImageElement
  id: number
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  file?: File
}

export const uploadImage = ({ img, id, virtualDom, setVirtualDom, file }: IUploadImage) => {
  return new Promise((resolve) => {
    if (file) {
      const formDate = new FormData()
      formDate.append('image', file)
      formDate.append('imageSrc', `${img.getAttribute('src')}`)

      axios
        .post(`${pathAPI}uploadImage.php`, formDate, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          const iframe = document.querySelector('iframe')
          const path = import.meta.env.MODE === 'development' ? '../api/' : './'
          const virtualImg = virtualDom?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
          const iframeImage = iframe?.contentDocument?.body.querySelector(
            `[img-editor-app="${id}"]`
          ) as HTMLImageElement

          if (virtualImg) {
            const newSrc = `${path}upload_image/${res.data.src}`
            const source = img.parentElement?.querySelector('source')
            const iframeSource = iframeImage.parentElement?.querySelector('source')

            if (source) {
              const virtualSource = virtualImg.parentElement && virtualImg.parentElement.querySelector('source')
              source.srcset = newSrc
              if (iframeSource) {
                iframeSource.srcset = newSrc
              }
              if (virtualSource) {
                virtualSource.srcset = newSrc
              }
            }

            img.src = newSrc
            virtualImg.src = newSrc
            iframeImage.src = newSrc

            setVirtualDom(virtualDom)
            toast.success('Uploaded to folder ./api/upload_image')
            resolve(img.src)
          }
        })
        .catch((e) => {
          toast.error(`Failed to upload! ${e}`)
        })
    }
  })
}
