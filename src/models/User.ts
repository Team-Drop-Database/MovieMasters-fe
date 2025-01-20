export type User = {
  id: number
  email: string
  username: string
  profile_picture: string
  role: Role
}

export enum Role {
  ROLE_USER,
  ROLE_MOD,
}
