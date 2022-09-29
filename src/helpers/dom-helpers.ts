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

export const serializeDOMToString = (dom: any) => {
  const scriptsModule: HTMLElement[] = dom.head.querySelectorAll('script[type="module"]')
  if (scriptsModule) {
    scriptsModule.forEach((el) => {
      el.remove()
    })
  }

  const serializer = new XMLSerializer()
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
  })
  return dom
}

export const unWrapImages = (dom: Document | any) => {
  dom.body.querySelectorAll('.img-editor-app').forEach((el: HTMLElement) => {
    el.removeAttribute('img-editor-app')
    el.classList.remove('img-editor-app')
  })
}
