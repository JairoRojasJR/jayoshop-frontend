type Props = {
  size?: number
  color?: 'black' | 'white'
  speed?: number
}

export const DotWaveLoader = ({
  size = 47,
  color = 'black',
  speed = 1
}: Props): JSX.Element => {
  return (
    <div className='container'>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
      <style jsx>{`
        .container {
          --uib-size: ${size}px;
          --uib-color: ${color};
          --uib-speed: ${speed}s;
          --uib-dot-size: calc(var(--uib-size) * 0.18);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: calc(var(--uib-size) * 0.5);
          width: var(--uib-size);
        }

        .dot {
          flex-shrink: 0;
          width: calc(var(--uib-size) * 0.17);
          height: calc(var(--uib-size) * 0.17);
          border-radius: 50%;
          background-color: var(--uib-color);
          transition: background-color 0.3s ease;
        }

        .dot:nth-child(1) {
          animation: jump var(--uib-speed) ease-in-out
            calc(var(--uib-speed) * -0.45) infinite;
        }

        .dot:nth-child(2) {
          animation: jump var(--uib-speed) ease-in-out
            calc(var(--uib-speed) * -0.3) infinite;
        }

        .dot:nth-child(3) {
          animation: jump var(--uib-speed) ease-in-out
            calc(var(--uib-speed) * -0.15) infinite;
        }

        .dot:nth-child(4) {
          animation: jump var(--uib-speed) ease-in-out infinite;
        }

        @keyframes jump {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-200%);
          }
        }
      `}</style>
    </div>
  )
}
