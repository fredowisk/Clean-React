import React, { useContext } from 'react'

import Styles from './input-styles.scss'

import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<
React.InputHTMLAttributes<HTMLInputElement>,
HTMLInputElement
> & {
  name: string
}

const Input: React.FC<Props> = (props: Props) => {
  const state = useContext(Context)

  const error = state[`${props.name}Error`]

  const setState = {
    email: state.setEmail,
    password: state.setPassword
  }

  const handleOnChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState[event.target.name](event.target.value)
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }

  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }

  return (
    <div className={Styles.inputWrap}>
      <input data-testid={props.name} {...props} onChange={handleOnChange} />
      <span
        data-testid={`${props.name}-status`}
        title={getTitle()}
        className={Styles.status}
      >
        {getStatus()}
      </span>
    </div>
  )
}

export default Input
