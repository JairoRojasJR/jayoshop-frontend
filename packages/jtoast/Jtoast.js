'use client'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  jtoastPanelCSS,
  jtoastItemCSS,
  appear,
  disappear
} from '@/packages/jtoast/JToast.module.css'
import { DotWave } from '@uiball/loaders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

let jtoastRoot
let counterToaster = 0
const toasters = []

export default function JToast() {
  let finished = false
  useEffect(() => {
    if (finished === false) {
      const jtoastHTML = document.getElementById('JToast')
      jtoastRoot = createRoot(jtoastHTML)
      finished = true
    }
  }, [])

  return <div id='JToast' className={`${jtoastPanelCSS} df fdc aic pf gpL`} />
}

function JtoastItem({ children, options, id }) {
  const [active, setActive] = useState(true)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState('')
  const jtoastItemRef = useRef(null)
  const { duration, isAsync, callback, onSuccess, handleError } = options || {}
  const defaultDuration = 3000

  useEffect(() => {
    const jtoastItemHTML = jtoastItemRef.current
    if (jtoastItemHTML) {
      jtoastItemHTML.style.animation = `${appear} .3s forwards`

      const runDisappear = () => {
        setTimeout(() => {
          jtoastItemHTML.style.animation = `${disappear} .3s forwards`
          setTimeout(() => {
            const index = toasters.findIndex(toast => toast.key === id)
            setActive(false)
            toasters.splice(index, 1)
          }, 300)
        }, duration || defaultDuration)
      }

      if (isAsync === true) {
        const runCallback = async () => {
          try {
            await callback()
            setPending(false)
            runDisappear()
          } catch (e) {
            setPending(false)
            setError(handleError ? handleError(e) : e.message)
            runDisappear()
          }
        }

        runCallback()
      } else runDisappear()
    }
  }, [])

  return (
    <>
      {active === true ? (
        <span
          ref={jtoastItemRef}
          className={`${jtoastItemCSS} df gpM aic pgL brM tac bcD crL`}
        >
          {isAsync && pending ? (
            <DotWave size={30} speed={1} color='white' />
          ) : null}
          {!pending && error.length === 0 && onSuccess ? (
            <>
              <FontAwesomeIcon
                icon={solid('circle-check')}
                color='var(--turquoise)'
                fontSize='1.3rem'
                fontWeight='bold'
              />
              {onSuccess}
            </>
          ) : null}
          {!pending && error.length > 0 ? (
            <>
              <FontAwesomeIcon
                icon={solid('circle-xmark')}
                color='var(--danger)'
                fontSize='1.3rem'
                fontWeight='bold'
              />
              {error}
            </>
          ) : null}
          {pending || !isAsync ? children : null}
        </span>
      ) : null}
    </>
  )
}

JtoastItem.propTypes = {
  children: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
}

function JtoastContainer() {
  return <>{toasters.map(toaster => toaster)}</>
}

export const jtoast = (msg, options = {}) => {
  counterToaster++
  const key = `toast-${counterToaster}`

  toasters.push(
    <JtoastItem key={key} options={options} id={key}>
      {msg}
    </JtoastItem>
  )

  jtoastRoot.render(<JtoastContainer />)
}
