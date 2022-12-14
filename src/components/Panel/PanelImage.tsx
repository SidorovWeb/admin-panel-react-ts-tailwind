import { ChangeEvent, FC, useRef } from 'react'
import { userActions } from '../../hooks/actions'
import { uploadImage } from '../../helpers/images'
import { BiImageAdd } from 'react-icons/bi'

interface IPanelImage {
  virtualDom: Document
  setVirtualDom: (dom: Document) => void
}

export const PanelImage: FC<IPanelImage> = ({ virtualDom, setVirtualDom }) => {
  const iframe = document.querySelector('iframe')
  const btnsEditorImg = useRef(null) as any
  const { setText } = userActions()
  const images = iframe?.contentDocument?.body.querySelectorAll(`.apsa-img`)

  const onMouseOver = () => {
    const id = btnsEditorImg.current.getAttribute('apsa-img-id')
    const img = iframe?.contentDocument?.body.querySelector(`[apsa-img="${id}"]`) as HTMLImageElement
    img.style.filter = 'grayscale(100%) blur(3px)'
    img.style.transition = '.25s ease-in-out'
    btnsEditorImg.current.style.opacity = '1 !important'
    btnsEditorImg.current.style.pointerEvents = 'auto'
  }

  const onMouseOut = () => {
    const id = btnsEditorImg.current.getAttribute('apsa-img-id')
    const img = iframe?.contentDocument?.body.querySelector(`[apsa-img="${id}"]`) as HTMLImageElement
    img.style.filter = 'inherit'
    img.style.transition = '.25s ease-in-out'
    btnsEditorImg.current.style.opacity = '1'
    btnsEditorImg.current.style.pointerEvents = 'none'
  }

  const uploadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const id = btnsEditorImg.current.getAttribute('apsa-img-id')
    if (id) {
      if (virtualDom && e.target.files && e.target.files[0]) {
        const img = iframe?.contentDocument?.body.querySelector(`[apsa-img="${id}"]`) as HTMLImageElement
        uploadImage({ img, id, virtualDom, setVirtualDom, file: e.target.files[0] })
      }
    }
  }

  const onClick = () => {
    const id = btnsEditorImg.current.getAttribute('apsa-img-id')

    if (id) {
      if (virtualDom) {
        const img = iframe?.contentDocument?.body.querySelector(`[apsa-img="${id}"]`) as HTMLImageElement
        const text = img.getAttribute('alt') ?? ''
        setText({ id, text, element: 'img', selector: `[apsa-img="${id}"]` })
      }
    }
  }

  return images && images?.length > 0 ? (
    <div
      className='btns-apsa-img p-1 z-99 fixed opacity-0 transition-opacity font-medium text-xs leading-tight uppercase space-x-1 pointer-events-none flex'
      ref={btnsEditorImg}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <button
        className={`btn-upload-img block btn-default h-[34px] w-[34px] rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg relative`}
        type='button'
      >
        <label className='flex flex-col items-center cursor-pointer absolute inset-0'>
          <input type='file' accept='image/*' className='hidden' onChange={(e) => uploadImg(e)} />
        </label>
        <BiImageAdd className='h-full w-full p-1 ml-[0.5px]' />
      </button>

      <button
        className={`btn-alt-img block btn-default h-[34px] w-[34px] rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg`}
        type='button'
        onClick={onClick}
        data-bs-toggle='modal'
        data-bs-target='#modalEditText'
      >
        Alt
      </button>
    </div>
  ) : (
    <></>
  )
}
