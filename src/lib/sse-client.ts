import { API_BASE_URL } from './constants'
import { getAccessToken } from './storage'
import type { ChatStreamEvent } from '../types/api'

export async function* streamChat(
  conversationId: string,
  content: string,
): AsyncGenerator<ChatStreamEvent> {
  // Mock mode
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { getMockStreamEvents } = await import('./mock-data')
    for (const event of getMockStreamEvents(content)) {
      await new Promise((r) => setTimeout(r, 50))
      yield event
    }
    return
  }

  const token = getAccessToken()
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${conversationId}/stream`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    },
  )

  if (!response.ok || !response.body) {
    throw new Error('Stream request failed')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    let currentEvent = ''
    let currentData = ''

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
      } else if (line.startsWith('data: ')) {
        currentData = line.slice(6).trim()
      } else if (line === '' && currentEvent && currentData) {
        const parsed = JSON.parse(currentData)
        yield { type: currentEvent, ...parsed } as ChatStreamEvent
        currentEvent = ''
        currentData = ''
      }
    }
  }
}
