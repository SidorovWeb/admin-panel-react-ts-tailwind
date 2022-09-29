import { FC, useRef } from 'react'
import { MdImage } from 'react-icons/md'
import { userActions } from '../../hooks/actions'
import { uploadImage } from '../../helpers/Images'

interface IControlPanelImg {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
  setLoading: (state: boolean) => void
}

export const ControlPanelImg: FC<IControlPanelImg> = ({ virtualDom, setVirtualDom, setLoading }) => {
  const iframe = document.querySelector('iframe')
  const btnsEditorImg = useRef(null) as any
  const { getDataImg } = userActions()

  const onMouseOver = () => {
    const id = btnsEditorImg.current.getAttribute('img-editor-id')
    const img = iframe?.contentDocument?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
    img.style.filter = 'grayscale(100%) blur(3px)'
    img.style.transition = '.25s ease-in-out'
    btnsEditorImg.current.style.opacity = '1 !important'
  }

  const onMouseOut = () => {
    const id = btnsEditorImg.current.getAttribute('img-editor-id')
    const img = iframe?.contentDocument?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
    img.style.filter = 'grayscale(0) blur(0)'
    img.style.transition = '.25s ease-in-out'
    btnsEditorImg.current.style.opacity = '1'
  }

  const uploadImg = () => {
    const id = btnsEditorImg.current.getAttribute('img-editor-id')
    if (id) {
      if (virtualDom) {
        const img = iframe?.contentDocument?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
        uploadImage(img, id, virtualDom, setVirtualDom, setLoading)
      }
    }
  }

  const getData = () => {
    const id = btnsEditorImg.current.getAttribute('img-editor-id')

    if (id) {
      if (virtualDom) {
        const img = iframe?.contentDocument?.body.querySelector(`[img-editor-app="${id}"]`) as HTMLImageElement
        const text = img.getAttribute('alt') ?? ''
        getDataImg({ id, text })
      }
    }
  }

  return (
    <div
      className='btns-editor-img p-1 z-998 fixed opacity-0 transition-opacity font-medium text-xs leading-tight uppercase space-y-1'
      ref={btnsEditorImg}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <button
        className={`btn-upload-img block btn-primary h-[30px] w-[30px] rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg `}
        type='button'
        onClick={uploadImg}
      >
        <MdImage className='h-full w-full' />
      </button>

      <button
        className={`btn-alt-img block btn-primary h-[30px] w-[30px] rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg`}
        type='button'
        onClick={getData}
        data-bs-toggle='modal'
        data-bs-target='#modalEditTextImg'
      >
        ALT
      </button>
    </div>
  )
}
