import { FC, useRef } from 'react'
import { MdModeEdit } from 'react-icons/md'
import { userActions } from '../../hooks/actions'
import { Button } from '../UI/Button'

export const ControlPanelText: FC = () => {
  const iframe = document.querySelector('iframe')
  const btnEditorText = useRef(null) as any
  const { setTextID } = userActions()

  const onclick = () => {
    const id = btnEditorText.current.getAttribute('text-editor-id')
    const textEl = iframe?.contentDocument?.body.querySelector(`[text-editor-app="${id}"]`) as HTMLElement
    const panelEditorText = document.querySelector('.panel-editor-text') as HTMLElement
    btnEditorText.current.style.opacity = '1'
    panelEditorText.style.display = 'flex'
    setTextID({ id })
    textEl.setAttribute('contentEditable', 'true')
    textEl.focus()

    setTimeout(() => {
      panelEditorText.style.opacity = '1'
    }, 115)
  }

  return (
    <div
      className='btn-editor-text p-1 z-998 opacity-0 fixed transition-opacity font-medium text-xs leading-tight uppercase space-y-1'
      ref={btnEditorText}
      onClick={onclick}
    >
      <Button
        clName={`block btn-secondary !p-1 rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg `}
      >
        <MdModeEdit className='h-[24px] w-full' />
      </Button>
    </div>
  )
}
