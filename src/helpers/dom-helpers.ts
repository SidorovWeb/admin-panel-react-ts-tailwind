export const parseStrDom = (str: string) => {
  const parser = new DOMParser()
  return parser.parseFromString(str, 'text/html')
}

export const wrapTextNodes = (dom: any) => {
  const body = dom.body
  let textNodes: ChildNode[] = []

  function recursion(element: ChildNode | HTMLElement) {
    element?.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue?.replace(/\s+/g, '').length > 0) {
        textNodes.push(node)
      } else {
        recursion(node)
      }
    })
  }

  if (body) {
    recursion(body)

    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement('text-editor')
      wrapper.className = 'text-editor-app'
      if (wrapper) {
        node.parentNode?.replaceChild(wrapper, node)
        wrapper.appendChild(node)
        wrapper.setAttribute('text-editor-app', i)
      }
    })
  }

  return dom
}

export const serializeDOMToString = (dom: any, setDom: (dom: string) => void) => {
  const deleteElements: HTMLElement[] = dom.head.querySelectorAll('script[type="module"]')
  deleteElements.forEach((el) => {
    el.remove()
  })

  const serializer = new XMLSerializer()
  setDom(serializer.serializeToString(dom))
  return serializer.serializeToString(dom)
}

export const unWrapTextNode = (dom: Document | any) => {
  const body = dom.body
  const textNodes: NodeList = body.querySelectorAll('.text-editor-app')
  textNodes.forEach((el) => {
    if (el && el.firstChild) {
      el.parentNode?.replaceChild(el.firstChild, el)
    }
  })
}

export const wrapImages = (dom: Document | any) => {
  dom.body.querySelectorAll('img').forEach((el: HTMLElement, idx: number) => {
    el.setAttribute('img-editor-app', `${idx}`)
    el.classList.add('img-editor-app')
    const editing = document.createElement('DIV')
    editing.classList.add('editing-btn-apsw')
    editing.style.cssText = `box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);background-color: #fff;width: 40px;height: 40px;position: absolute;z-index: 998;top: 50%;right: 10px;transform: translateY(-50%);border-radius: 10px;display: flex;align-items: center;justify-content: center;overflow: hidden;cursor: pointer;display: none;transition: all 0.3s ease;`
    editing.innerHTML = `
    <svg class="editing-btn-svg-apsw" stroke="currentColor" fill="black" stroke-width="0" viewBox="0 0 24 24" height="90%" width="90%" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>`
    const parent = el.parentNode as HTMLElement
    parent.append(editing)
  })
  return dom
}

export const unWrapImages = (dom: Document | any) => {
  dom.body.querySelectorAll('.img-editor-app').forEach((el: HTMLElement) => {
    el.removeAttribute('img-editor-app')
    el.classList.remove('img-editor-app')
  })
}
