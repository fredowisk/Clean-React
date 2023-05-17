import React, { FormEvent, useEffect, useState } from 'react'

import { Link, useHistory } from 'react-router-dom'

import Styles from './signup-styles.scss'

import {
  Footer,
  Input,
  FormStatus,
  SubmitButton
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount, SaveAccessToken } from '@/domain/usecases'

type Props = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

const SignUp: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken
}: Props) => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState('')

  useEffect(() => {
    setNameError(validation.validate('name', name))
    setEmailError(validation.validate('email', email))
    setPasswordError(validation.validate('password', password))
    setPasswordConfirmationError(
      validation.validate('passwordConfirmation', { passwordConfirmation, password })
    )
  }, [name, email, password, passwordConfirmation])

  const handleOnSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()

    try {
      if (
        isLoading ||
        nameError ||
        emailError ||
        passwordError ||
        passwordConfirmationError
      ) {
        return
      }

      setIsLoading(true)
      const account = await addAccount.add({
        name,
        email,
        password,
        passwordConfirmation
      })

      await saveAccessToken.save(account.accessToken)
      history.replace('/')
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.message)
    }
  }

  return (
    <div className={Styles.signup}>
      <Context.Provider
        value={{
          isLoading,
          errorMessage,
          nameError,
          emailError,
          passwordError,
          passwordConfirmationError,
          setName,
          setEmail,
          setPassword,
          setPasswordConfirmation
        }}
      >
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleOnSubmit}
        >
          <h2>Criar conta</h2>

          <Input
            data-testid="name"
            type="text"
            name="name"
            placeholder="Digite seu nome"
          />
          <Input
            data-testid="email"
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
          />
          <Input
            data-testid="password"
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            data-testid="passwordConfirmation"
            type="password"
            name="passwordConfirmation"
            placeholder="Confirme sua senha"
          />

          <SubmitButton text="Salvar" />
          <Link data-testid="register" to="/login" className={Styles.link}>
            Voltar para Login
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
