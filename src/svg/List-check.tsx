import { type SVGProps } from '@/types'

export default function ListCheck(props: SVGProps): JSX.Element {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='icon icon-tabler icon-tabler-list-check'
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
      <path d='M3.5 5.5l1.5 1.5l2.5 -2.5' />
      <path d='M3.5 11.5l1.5 1.5l2.5 -2.5' />
      <path d='M3.5 17.5l1.5 1.5l2.5 -2.5' />
      <path d='M11 6l9 0' />
      <path d='M11 12l9 0' />
      <path d='M11 18l9 0' />
    </svg>
  )
}
