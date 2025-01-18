export type HandleEvent<T> = (e: T) => Promise<void>
export type SubmitEvent = React.FormEvent<HTMLFormElement>
export type OnSubmit = HandleEvent<SubmitEvent>
// export type MouseEvent = HandleEvent<React.MouseEvent<HTMLButtonElement>>
export type MouseEvent<T> = React.MouseEvent<T, MouseEvent>

type SearchParams = Record<string, string | undefined>
export type NextServerProps = { searchParams: SearchParams }

type Changables = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
export type TypingMainInputsEvent = React.ChangeEvent<Changables>
