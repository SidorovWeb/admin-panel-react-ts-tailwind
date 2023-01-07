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
      wrapper.className = 'apsa-text'
      if (wrapper) {
        node.parentNode?.replaceChild(wrapper, node)
        wrapper.appendChild(node)
        wrapper.setAttribute('apsa-text', i + 1)
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
  const textNodes: NodeList = body.querySelectorAll('.apsa-text')
  textNodes.forEach((el) => {
    if (el && el.firstChild) {
      el.parentNode?.replaceChild(el.firstChild, el)
    }
  })
  return dom
}

export const wrapImages = (dom: Document | any) => {
  dom.body.querySelectorAll('img').forEach((el: HTMLElement, idx: number) => {
    el.setAttribute('apsa-img', `${idx}`)
    el.classList.add('apsa-img')
  })
  return dom
}

export const unWrapImages = (dom: Document | any) => {
  dom.body.querySelectorAll('.apsa-img').forEach((el: HTMLElement) => {
    el.removeAttribute('apsa-img')
    el.classList.remove('apsa-img')
  })
  return dom
}
