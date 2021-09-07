/**
 * 拦截浏览器跳转
 * @author 余聪
 */

export function register({ onInterceptors = () => {} }: { onInterceptors?: (nextUrl: string | URL) => void | false }) {
  if (typeof location === 'undefined') {
    return
  }

  function handleUrl(url: any) {
    if (url) {
      return onInterceptors(url) !== false
    }
    return true
  }

  function linkJumpClickHandle(evt: MouseEvent) {
    if ((evt.target as any)?.tagName === 'A') {
      const elem: HTMLLinkElement = evt.target as any
      const href = elem.href

      if (!handleUrl(href)) {
        evt.preventDefault()
        return
      }
    }
  }

  window.document.addEventListener('click', linkJumpClickHandle)

  // const attrs = ['href', 'host', 'hostname', 'protocol', 'port']
  // attrs.forEach(name => {
  //   let originVal = location[name]
  //   Object.defineProperty(location, name, {
  //     configurable: true,
  //     get() {
  //     },
  //     set(v) {
  //     }
  //   })
  // })

  const oldOpen = window.open
  window.open = function open(url, target, features) {
    if (!handleUrl(url)) {
      return
    }
    return oldOpen.apply(this, [url, target, features])
  }

  return () => {
    window.open = oldOpen

    window.document.removeEventListener('click', linkJumpClickHandle)
  }
}
