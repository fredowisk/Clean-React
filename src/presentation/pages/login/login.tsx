import React, { FormEvent, useEffect, useState } from 'react'

import { Link, useHistory } from 'react-router-dom'

import Styles from './login-styles.scss'

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    setEmailError(validation.validate('email', email))
    setPasswordError(validation.validate('password', password))
  }, [email, password])

  const handleOnSubmit = async (event: FormEvent): Promise<void> => {
    try {
      event.preventDefault()

      if (isLoading || emailError || passwordError) {
        return
      }

      setIsLoading(true)
      const account = await authentication.auth({ email, password })

      localStorage.setItem('accessToken', account.accessToken)
      history.replace('/')
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.message)
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider
        value={{
          isLoading,
          errorMessage,
          emailError,
          passwordError,
          setEmail,
          setPassword
        }}
      >
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleOnSubmit}
        >
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <button
            data-testid="submit"
            disabled={!!emailError || !!passwordError}
            className={Styles.submit}
            type="submit"
          >
            Entrar
          </button>
          <Link data-testid="register" to="/signup" className={Styles.link}>
            Criar conta
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
