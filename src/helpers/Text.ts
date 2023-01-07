import { store } from '../store/store'
import { textEditorPanelActions } from '../store/slices/textEditorPanel'

export const processingText = (el: HTMLElement, virtualDom: Document, setVirtualDom: (dom: Document) => void) => {
  const id = el.getAttribute('apsa-text')

  const setsStyleBtnText = () => {
    store.dispatch(textEditorPanelActions.setTextID({ id: Number(id) }))
  }

  const onClick = (el: HTMLElement) => {
    el.setAttribute('contentEditable', 'true')
    el.focus()
  }

  el.addEventListener('click', () => {
    onClick(el)
    setsStyleBtnText()
  })

  el.addEventListener('blur', () => {
    el.removeAttribute('contentEditable')
    el.blur()
  })

  el.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      el.removeAttribute('contentEditable')
    }
  })

  el.addEventListener('input', () => {
    const virtualElem = virtualDom?.body.querySelector(`[apsa-text="${id}"]`)
    if (virtualElem) {
      virtualElem.innerHTML = el.innerHTML
      setVirtualDom(virtualDom)
      setsStyleBtnText()
    }
  })

  el.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    onClick(el)
    setsStyleBtnText()
  })
}
