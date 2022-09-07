export const rect = (el: HTMLElement) => {
  const top = el.getBoundingClientRect().top + document.documentElement.scrollTop
  const left = el.getBoundingClientRect().left
  const height = el.getBoundingClientRect().height
  const width = el.getBoundingClientRect().width

  return { top, left, height, width }
}
