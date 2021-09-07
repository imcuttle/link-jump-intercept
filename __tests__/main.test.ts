/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
import { register } from '../src'

const delay = (ms?) => new Promise((resolve) => setTimeout(resolve, ms))

const handle = async (trigger: any, { useDelay = true } = {}) => {
  location.href = ''
  const nextUrls = []
  const un = register({
    onInterceptors(nextUrl) {
      nextUrls.push(nextUrl)
    }
  })

  useDelay && (await delay())
  expect(location.href).toBe('http://localhost/')

  trigger()
  useDelay && (await delay())
  expect(nextUrls).toMatchObject([/#\/lalala/])

  trigger()
  useDelay && (await delay())
  expect(nextUrls).toMatchObject([/#\/lalala/, /#\/lalala/])

  un()

  trigger()
  useDelay && (await delay())
  expect(nextUrls).toMatchObject([/#\/lalala/, /#\/lalala/])
}

describe('linkJumpIntercept', function () {
  it('should click link intercepted', async function () {
    document.body.innerHTML = `
      <a id='link' href='#/lalala'>click</a>`
    await handle(() => window['link'].click())
    expect(location.href).toBe('http://localhost/#/lalala')
  })

  it('should click link cancelled', async function () {
    location.href = ''
    document.body.innerHTML = `
      <a id='link' href='#/lalala'>click</a>`

    const un = register({
      onInterceptors(nextUrl) {
        return false
      }
    })

    window['link'].click()
    await delay()
    expect(location.href).toBe('http://localhost/')
    un()
  })

  it('should window.open cancelled', async function () {
    // @ts-ignore
    window.open = jest.fn(() => {})
    await handle(() => window.open('#/lalala'))
  })
})
