export const runTransition = (transitions, toggle) => {
  return new Promise((resolve, reject) => {
    let totalProperties = 0
    let transitionsCompleteds = 0

    transitions.forEach(transition => {
      totalProperties += Object.keys(transition.properties).length
    })

    for (const transition of transitions) {
      const { element, properties, display } = transition

      const displayAction = display?.action
      const runAction = time => {
        if (displayAction) {
          let action, callback
          if (Array.isArray(displayAction)) {
            action = displayAction[0]
            if (displayAction[1]) callback = displayAction[1]
          } else action = displayAction

          const isShowing = time === 'start' && action === 'show'
          const isHidden = time === 'end' && action === 'hidde'
          if (isShowing) element.style.display = 'flex'
          else if (isHidden) element.style.display = 'none'
          if ((isShowing || isHidden) && callback) callback()
        }
      }

      const setProperties = () => {
        return new Promise((resolve, reject) => {
          const endOfTransition = end => {
            transitionsCompleteds++
            element.removeEventListener('transitionend', end)

            runAction('end')
            const finished = transitionsCompleteds === totalProperties
            if (finished) resolve('finished')
          }

          for (const property in properties) {
            const value = properties[property]
            if (value[toggle] === 'scrollHeight') {
              element.style.height = `${element.scrollHeight}px`
            } else element.style[property] = value[toggle]
            const end = () => endOfTransition(end)
            element.addEventListener('transitionend', end)
          }
        })
      }

      runAction('start')
      setTimeout(() => {
        setProperties().then(() => resolve('completed'))
      }, 1)
    }
  })
}
