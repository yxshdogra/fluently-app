import { useReducer, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '../types/models'
import type { OtpVerifyData } from '../types/api'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/storage'
import { get, post } from '../lib/api-client'
import { AuthContext } from './auth-context'
import { useNotifications } from '../hooks/useNotifications'

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

interface AuthState {
  status: AuthStatus
  user: User | null
  accessToken: string | null
}

type AuthAction =
  | { type: 'SET_AUTHENTICATED'; user: User; accessToken: string }
  | { type: 'SET_UNAUTHENTICATED' }
  | { type: 'SET_LOADING' }
  | { type: 'UPDATE_USER'; user: User }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading' }
    case 'SET_AUTHENTICATED':
      return { status: 'authenticated', user: action.user, accessToken: action.accessToken }
    case 'SET_UNAUTHENTICATED':
      return { status: 'unauthenticated', user: null, accessToken: null }
    case 'UPDATE_USER':
      return { ...state, user: action.user }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    status: 'loading',
    user: null,
    accessToken: null,
  })

  const { register, unregister } = useNotifications()

  useEffect(() => {
    const token = getAccessToken()
    const refresh = getRefreshToken()

    if (!token && !refresh) {
      dispatch({ type: 'SET_UNAUTHENTICATED' })
      return
    }

    get<User>('/users/me')
      .then((user) => {
        dispatch({ type: 'SET_AUTHENTICATED', user, accessToken: getAccessToken()! })
        // Re-register token on session restore so returning users stay subscribed
        register().catch(() => {})
      })
      .catch(() => {
        clearTokens()
        dispatch({ type: 'SET_UNAUTHENTICATED' })
      })
  }, [register])

  const login = useCallback((data: OtpVerifyData) => {
    setTokens(data.access_token, data.refresh_token)
    dispatch({ type: 'SET_AUTHENTICATED', user: data.user, accessToken: data.access_token })
    // Fire-and-forget — never block login on notification permission
    register().catch(() => {})
  }, [register])

  const logout = useCallback(async () => {
    await unregister().catch(() => {})
    try {
      await post('/auth/logout')
    } catch {
      // Ignore logout API errors
    }
    clearTokens()
    dispatch({ type: 'SET_UNAUTHENTICATED' })
  }, [unregister])

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', user })
  }, [])

  return (
    <AuthContext.Provider value={{ status: state.status, user: state.user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
