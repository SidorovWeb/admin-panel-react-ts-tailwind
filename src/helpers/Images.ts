import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../Constants'
import { rect } from './utils'

export const processingImages = (el: HTMLImageElement, iframe: HTMLIFrameElement) => {
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

  parent.addEventListener('mousemove', (e) => {
    if (!btnsEditorImg) btnsEditorImg = document.querySelector('.btns-editor-img') as HTMLElement
    return
  })

  parent.addEventListener('mouseover', (e) => {
    if (btnsEditorImg) setsStyleBtnUploadImg()
  })
  parent.addEventListener('mousemove', (e) => {
    if (btnsEditorImg) {
      btnsEditorImg.style.opacity = '1'
      setsStyleBtnUploadImg()
    }
  })

  iframe.contentDocument?.addEventListener('scroll', () => {
    if (btnsEditorImg) btnsEditorImg.style.opacity = '0'
  })
}

export const uploadImage = (
  img: HTMLImageElement,
  id: string,
  virtualDom: Document,
  setVirtualDom: (dom: Document) => void,
  setLoading: (state: boolean) => void
) => {
  return new Promise((resolve, reject) => {
    const virtualElem = virtualDom?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
    const btnUpload = document.querySelector('.btn-upload-img') as HTMLElement
    document.querySelectorAll('.img-upload-editor-app').forEach((u) => u.remove())
    const imgUpload = document.createElement('INPUT') as HTMLInputElement
    imgUpload.setAttribute('type', 'file')
    imgUpload.setAttribute('accept', 'image/*')
    imgUpload.style.display = 'none'
    imgUpload.classList.add('img-upload-editor-app')
    btnUpload?.after(imgUpload)
    imgUpload?.click()
    imgUpload?.addEventListener('change', () => {
      if (imgUpload.files && imgUpload.files[0]) {
        const formDate = new FormData()
        formDate.append('image', imgUpload.files[0])
        setLoading(true)
        axios
          .post(`${pathAPI}uploadImage.php`, formDate, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            const path = import.meta.env.MODE === 'development' ? '../api/' : '../api/'
            img.src = `${path}img/${res.data.src}`
            if (virtualElem) {
              virtualElem.src = img.src
              setVirtualDom(virtualDom)
              toast.success('Успешно загружено')
              resolve(img.src)
            }
          })
          .catch((e) => {
            toast.error(`Загрузить не удалось! ${e}`)
          })
          .finally(() => {
            imgUpload.value = ''
            imgUpload.remove()
            setLoading(false)
          })
        // })
      }
    })
  })
}
