import React, { useState } from 'react'

import Styles from './login-styles.scss'

import {
  LoginHeader,
  Footer,
  Input,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

const Login: React.FC = () => {
  const [isLoading] = useState(false)
  const [errorMessage] = useState('')

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ isLoading, errorMessage }}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input />

          <button className={Styles.submit} type="submit">
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
