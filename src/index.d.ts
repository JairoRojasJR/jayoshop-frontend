/* eslint-disable no-var */

import type { Root } from 'react-dom/client'

declare global {
  var isProdMode: boolean
  var backendUrl: string | undefined
  var streamImage: string | undefined
  var navMainHTML: HTMLElement
  var MODAL_ROOT_CREATED: boolean
  var MODAL_ROOT: Root
  var MODAL_HTML: HTMLElement
}

export {}
