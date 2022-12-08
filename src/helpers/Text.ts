import { store } from '../store/store'
import { textEditorPanelActions } from '../store/TextEditorPanel/TextEditorPanel'

export const processingText = (el: HTMLElement, virtualDom: Document, setVirtualDom: (dom: Document) => void) => {
  const id = el.getAttribute('text-editor-app')

  const setsStyleBtnText = () => {
    store.dispatch(textEditorPanelActions.setTextID({ id: Number(id) }))
  }

  const onClick = (el: HTMLElement) => {
    el.setAttribute('contentEditable', 'true')
    el.focus()
  }

  el.addEventListener('click', (e) => {
    // if (el.parentNode?.nodeName === 'A') {
    //   e.stopPropagation()
    // }

    onClick(el)
    setsStyleBtnText()
  })

  el.addEventListener('blur', (e) => {
    el.removeAttribute('contentEditable')
    el.blur()
  })

  el.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      el.removeAttribute('contentEditable')
    }
  })

  el.addEventListener('input', () => {
    const virtualElem = virtualDom?.body.querySelector(`[text-editor-app="${id}"]`)
    if (virtualElem) {
      virtualElem.innerHTML = el.innerHTML
      setVirtualDom(virtualDom)
      setsStyleBtnText()
    }
  })

  el.addEventListener('contextmenu', (e) => {
    if (el.parentNode?.nodeName === 'A' || el.parentNode?.nodeName === 'BUTTON') {
      e.preventDefault()
      onClick(el)
      setsStyleBtnText()
    }
  })
}
