import axios from 'axios'
import { toast } from 'react-toastify'
import { pathAPI } from '../../Constants'

export const editorImages = (
  el: HTMLImageElement,
  virtualDom: Document,
  setVirtualDom: (dom: Document) => void,
  setLoading: (state: boolean) => void
) => {
  const parent = el.parentNode as HTMLElement
  const editBtn = parent.querySelector('.editing-btn-apsw') as HTMLElement
  const svg = editBtn.querySelector('.editing-btn-svg-apsw') as HTMLOrSVGImageElement
  parent.classList.add('parent-editing-btn-apsw')

  parent.addEventListener('mouseover', (e) => {
    editBtn.style.display = 'flex'
  })

  parent.addEventListener('mouseout', () => {
    editBtn.style.display = 'none'
    parent.classList.remove('parent-editing-btn-apsw')
  })

  editBtn.addEventListener('click', (e) => {
    uploadImage()
  })

  editBtn.addEventListener('mouseover', (e) => {
    editBtn.style.cssText += 'background-color: #25a34a'
    svg.style.cssText = 'fill: #fff;'
  })
  editBtn.addEventListener('mouseout', (e) => {
    editBtn.style.cssText += 'background-color: #fff'
    svg.style.cssText = 'fill: black;'
  })

  const uploadImage = () => {
    const id = el.getAttribute('img-editor-app')
    const virtualElem = virtualDom?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement

    document.querySelectorAll('.img-upload-editor-app').forEach((u) => u.remove())

    const imgUpload = document.createElement('INPUT') as HTMLInputElement
    imgUpload.setAttribute('type', 'file')
    imgUpload.setAttribute('accept', 'image/*')
    imgUpload.style.display = 'none'
    imgUpload.classList.add('img-upload-editor-app')
    el.after(imgUpload)

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
            const path = import.meta.env.MODE === 'development' ? '../../../api/' : '../api/'
            el.src = `${path}img/${res.data.src}`

            if (virtualElem) {
              virtualElem.src = el.src
              setVirtualDom(virtualDom)
              toast.success('Успешно загружено')
            }
          })
          .catch((e) => toast.error(`Загрузить не удалось! ${e}`))
          .finally(() => {
            imgUpload.value = ''
            imgUpload.remove()
            setLoading(false)
          })
      }
    })
  }

  // el.addEventListener('click', () => {
  //   const id = el.getAttribute('img-editor-app')
  //   const virtualElem = virtualDom?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement

  //   document.querySelectorAll('.img-upload-editor-app').forEach((u) => u.remove())

  //   const imgUpload = document.createElement('INPUT') as HTMLInputElement
  //   imgUpload.setAttribute('type', 'file')
  //   imgUpload.setAttribute('accept', 'image/*')
  //   imgUpload.style.display = 'none'
  //   imgUpload.classList.add('img-upload-editor-app')
  //   el.after(imgUpload)

  //   imgUpload?.click()
  //   imgUpload?.addEventListener('change', () => {
  //     if (imgUpload.files && imgUpload.files[0]) {
  //       const formDate = new FormData()
  //       formDate.append('image', imgUpload.files[0])
  //       setLoading(true)

  //       axios
  //         .post(`${pathAPI}uploadImage.php`, formDate, {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         })
  //         .then((res) => {
  //           const path = import.meta.env.MODE === 'development' ? '../../../api/' : '../api/'
  //           el.src = `${path}img/${res.data.src}`

  //           if (virtualElem) {
  //             virtualElem.src = el.src
  //             setVirtualDom(virtualDom)
  //           }
  //         })
  //         .catch((e) => toast.error(`Загрузить не удалось! ${e}`))
  //         .finally(() => {
  //           imgUpload.value = ''
  //           imgUpload.remove()
  //           toast.success('Успешно загружено')
  //           setLoading(false)
  //         })
  //     }
  //   })
  // })
}
