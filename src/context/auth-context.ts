import { createContext } from 'react'
import type { User } from '../types/models'
import type { OtpVerifyData } from '../types/api'

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (data: OtpVerifyData) => void
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
