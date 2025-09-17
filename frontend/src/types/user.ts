export type User = {
  id: string
  email: string
  username: string
  name?: string
  surname?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  username: string
  password: string
  name?: string
  surname?: string
}
