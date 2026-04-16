import { getToken, onMessage } from 'firebase/messaging'
import { useCallback } from 'react'
import { messaging } from '../lib/firebase'
import { post } from '../lib/api-client'
import type { RegisterFcmTokenRequest } from '../types/api'

// Module-level: ensures only one foreground listener is active at a time
// across all component instances that call useNotifications()
let unsubscribeOnMessage: (() => void) | null = null

export function useNotifications() {
  const register = useCallback(async (): Promise<void> => {
    // messaging is null when Firebase env vars are missing or SW is unsupported
    if (!messaging) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })
    if (!token) return

    const body: RegisterFcmTokenRequest = { token, platform: 'web' }
    await post('/users/fcm-token', body)

    // Remove the previous listener before attaching a new one —
    // Firebase does not deduplicate, so calling onMessage() multiple times
    // without unsubscribing causes duplicate foreground notifications.
    unsubscribeOnMessage?.()
    unsubscribeOnMessage = onMessage(messaging, (payload) => {
      if (!payload.notification) return
      new Notification(payload.notification.title ?? 'Fluently', {
        body: payload.notification.body ?? '',
        icon: '/fluently-logo.svg',
      })
    })
  }, [])

  const unregister = useCallback(async (): Promise<void> => {
    unsubscribeOnMessage?.()
    unsubscribeOnMessage = null
    // Token invalidation is handled server-side on logout.
    // Flutter equivalent: FirebaseMessaging.instance.deleteToken()
  }, [])

  return { register, unregister }
}
