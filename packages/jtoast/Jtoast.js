import {
  jtoastPanelCSS,
  jtoastItemCSS,
  appear,
  disappear
} from '@/packages/jtoast/JToast.module.css'

export const jtoast = (msg, options = {}) => {
  const { duration } = options
  const defaultDuration = 3000

  const jtoastPanel = document.getElementById('JToast')
  const jtoastItem = document.createElement('span')
  jtoastItem.classList.add(jtoastItemCSS, 'pgL', 'brM', 'tac', 'bcD')
  jtoastItem.textContent = msg

  jtoastPanel.appendChild(jtoastItem)
  jtoastItem.style.animation = `${appear} .3s forwards`
  setTimeout(() => {
    jtoastItem.style.animation = `${disappear} .3s forwards`
    setTimeout(() => jtoastPanel.removeChild(jtoastItem), 300)
  }, duration || defaultDuration)
}

export default function JToast() {
  return <div id='JToast' className={`${jtoastPanelCSS} df fdc aic pf gpL`} />
}
