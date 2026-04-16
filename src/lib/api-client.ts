import { API_BASE_URL } from './constants'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './storage'
import type { ApiResponse, ApiErrorResponse, TokenRefreshData } from '../types/api'

export class ApiError extends Error {
  code: string
  status: number
  details?: Record<string, string>

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

async function refreshAccessToken(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokens()
    throw new ApiError(401, 'NO_REFRESH_TOKEN', 'No refresh token available')
  }

  const res = await fetch(`${API_BASE_URL}/auth/token/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) {
    clearTokens()
    throw new ApiError(401, 'REFRESH_FAILED', 'Token refresh failed')
  }

  const json = (await res.json()) as ApiResponse<TokenRefreshData>
  setTokens(json.data.access_token, json.data.refresh_token)
}

async function handleTokenRefresh(): Promise<void> {
  if (isRefreshing) {
    return refreshPromise!
  }
  isRefreshing = true
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false
    refreshPromise = null
  })
  return refreshPromise
}

type FetchOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  skipAuth?: boolean
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  // Mock mode
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { getMockResponse } = await import('./mock-data')
    return getMockResponse<T>(path, options.method || 'GET', options.body)
  }

  const makeRequest = async (): Promise<T> => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    }

    if (!options.skipAuth) {
      const token = getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
    })

    if (res.status === 401 && !options.skipAuth) {
      await handleTokenRefresh()
      // Retry with new token
      const retryToken = getAccessToken()
      if (retryToken) {
        headers['Authorization'] = `Bearer ${retryToken}`
      }
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method || 'GET',
        headers,
        body: options.body instanceof FormData
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
      })

      if (!retryRes.ok) {
        const err = (await retryRes.json()) as ApiErrorResponse
        throw new ApiError(retryRes.status, err.error.code, err.error.message, err.error.details)
      }

      const json = await retryRes.json()
      return json.data as T
    }

    if (!res.ok) {
      const err = (await res.json()) as ApiErrorResponse
      throw new ApiError(res.status, err.error.code, err.error.message, err.error.details)
    }

    const json = await res.json()
    return json.data as T
  }

  return makeRequest()
}

export function get<T>(path: string, skipAuth = false): Promise<T> {
  return request<T>(path, { skipAuth })
}

export function post<T>(path: string, body?: unknown, skipAuth = false): Promise<T> {
  return request<T>(path, { method: 'POST', body, skipAuth })
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body })
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' })
}

export function upload<T>(path: string, file: File, fieldName = 'file'): Promise<T> {
  const formData = new FormData()
  formData.append(fieldName, file)
  return request<T>(path, { method: 'POST', body: formData })
}
