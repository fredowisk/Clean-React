import React from 'react'

import Styles from './spinner-styles.scss'

type SpinnerProps = React.HTMLAttributes<HTMLElement> & {
  className: string
}

const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => {
  return (
    <div
      {...props}
      data-testid="spinner"
      className={[Styles.spinner, props.className].join(' ')}
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

export default Spinner
