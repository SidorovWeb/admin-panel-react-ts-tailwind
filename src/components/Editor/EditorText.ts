export const editorText = (el: HTMLElement, virtualDom: Document, setVirtualDom: (dom: Document) => void) => {
  const onClick = (el: HTMLElement) => {
    el.setAttribute('contentEditable', 'true')
    el.focus()
  }

  el.addEventListener('click', () => {
    onClick(el)
  })

  el.addEventListener('blur', () => {
    el.removeAttribute('contentEditable')
  })

  el.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      el.removeAttribute('contentEditable')
    }
  })

  el.addEventListener('input', () => {
    const id = el.getAttribute('text-editor-app')
    const virtualElem = virtualDom?.body.querySelector(`[text-editor-app="${id}"]`)
    if (virtualElem) {
      virtualElem.innerHTML = el.innerHTML
      setVirtualDom(virtualDom)
    }
  })

  el.addEventListener('contextmenu', (e) => {
    if (el.parentNode?.nodeName === 'A' || el.parentNode?.nodeName === 'BUTTON') {
      e.preventDefault()
      onClick(el)
    }
  })
}
