import React, { useEffect, useState } from 'react'

import Styles from './login-styles.scss'

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [isLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage] = useState('')
  const [emailError, setEmailError] = useState('Campo obrigatório')
  const [passwordError, setPasswordError] = useState('Campo obrigatório')

  useEffect(() => {
    setEmailError(validation.validate('email', email))
  }, [email])

  useEffect(() => {
    setPasswordError(validation.validate('password', password))
  }, [password])

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
        <form className={Styles.form}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <button
            data-testid="submit"
            disabled
            className={Styles.submit}
            type="submit"
          >
            Entrar
          </button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
