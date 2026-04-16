// firebase-messaging-sw.js — Web-only background notification handler
// ⚠️ Flutter does NOT use this file. Flutter handles background notifications
// via a top-level Dart function decorated with @pragma('vm:entry-point').
//
// IMPORTANT: Service workers cannot access import.meta.env.
// Replace the placeholder values below with your actual Firebase project config
// (same values as your .env VITE_FIREBASE_* vars, hardcoded here).

importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'REPLACE_WITH_VITE_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_VITE_FIREBASE_APP_ID',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification?.title ?? 'Fluently', {
    body: payload.notification?.body ?? '',
    icon: '/fluently-logo.svg',
  })
})
