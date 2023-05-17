export interface FieldValidation {
  field: string
  validate: ((value: string) => Error) | ((input: object) => Error)
}
