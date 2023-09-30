import { type SVGProps } from '@/types'

export default function ArrowUp(props: SVGProps): JSX.Element {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='icon icon-tabler icon-tabler-arrow-narrow-up'
      height='1em'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 5l0 14' />
      <path d='M16 9l-4 -4' />
      <path d='M8 9l4 -4' />
    </svg>
  )
}
