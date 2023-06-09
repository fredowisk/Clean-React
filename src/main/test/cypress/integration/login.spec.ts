import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('login')
  })

  it('should load with correct initial state', () => {
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢')
    cy.getByTestId('password').focus().type(faker.internet.password())
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🟢')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present InvalidCredentialsError on 401', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 401,
      response: {
        error: faker.random.words()
      }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.internet.password())
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should(
      'contain.text',
      'Credenciais inválidas'
    )

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('should present UnexpectedError on 400', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 400,
      response: {
        error: faker.random.words()
      }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.internet.password())
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente.'
    )

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('should present UnexpectedError on 400 if invalid data is returned', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        invalidProperty: faker.random.uuid()
      }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.internet.password())
    cy.getByTestId('submit').click()
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente.'
    )

    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('should present save accessToken if valid credentials are provided', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.random.uuid()
      }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.internet.password())
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem('accessToken'))
    )
  })

  it('should not call submit if form is invalid', () => {
    cy.route({
      method: 'POST',
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.random.uuid()
      }
    }).as('request')

    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})
