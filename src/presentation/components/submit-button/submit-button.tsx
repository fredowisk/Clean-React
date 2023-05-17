import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  text: string
}

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
  const { nameError, emailError, passwordError, passwordConfirmationError } =
    useContext(Context)

  return (
    <button
      data-testid="submit"
      type="submit"
      disabled={
        nameError || emailError || passwordError || passwordConfirmationError
      }
    >
      {text}
    </button>
  )
}

export default SubmitButton
