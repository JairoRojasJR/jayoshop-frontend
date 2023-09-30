import type { Toggle, Transition, TransitionProperties } from '@/types'
import { setTimeout } from 'timers'

export const runTransition = async (
  transitions: Transition[],
  toggle: Toggle
): Promise<void> => {
  await new Promise((resolve, reject) => {
    for (const transition of transitions) {
      const { element, properties, display } = transition

      if (element === undefined) reject(new Error('Falta el elemento'))

      const setProperties = async (): Promise<void> => {
        await new Promise(resolve => {
          const endOfTransition = (end: () => void): void => {
            const hidde = display !== undefined && toggle === 0
            if (hidde) element.classList.add('invisible')
            element.removeEventListener('transitionend', end)
            resolve('finished')
          }

          const assignProperties = (processeds: TransitionProperties): void => {
            const from = processeds.from
            const to = processeds.to
            const propertiesTo = toggle === 0 ? from : to

            Object.assign(element.style, propertiesTo)

            const listener = (): void => {
              endOfTransition(listener)
            }

            element.addEventListener('transitionend', listener)
          }

          if (typeof properties === 'function') {
            setTimeout(() => {
              assignProperties(properties())
            }, 0)
          } else {
            assignProperties(properties)
          }
        })
      }

      const isInvisible = element.classList.contains('invisible')

      if (display !== undefined && toggle === 1) {
        const warn = `El elemento ${element.tagName} no tiene la clase invisible`
        if (!isInvisible) console.warn(warn)
        element.classList.remove('invisible')
      }

      const warn = `Para el elemento ${element.tagName}, falta la propiedad display`
      if (isInvisible && display === undefined) console.warn(warn)

      if (typeof display === 'function') display()
      setTimeout(() => {
        setProperties()
          .then(() => {
            resolve('Completed')
          })
          .catch((e: Error) => {
            console.log(e)
          })
      }, 0)
    }
  })
}
