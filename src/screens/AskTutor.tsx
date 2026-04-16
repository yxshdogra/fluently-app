import { useState, useRef, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { get, post } from '../lib/api-client'
import { streamChat } from '../lib/sse-client'
import type { ChatSuggestion, Conversation, ChatMessage } from '../types/api'

export default function AskTutor() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: suggestions } = useApi<ChatSuggestion[]>(() => get('/chat/suggestions'), [])

  // Create or get conversation on mount
  useEffect(() => {
    post<Conversation>('/chat/conversations').then((conv) => {
      setConversationId(conv.id)
      // Load existing messages
      get<ChatMessage[]>(`/chat/conversations/${conv.id}/messages`).then((msgs) => {
        setMessages(msgs)
      })
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(content?: string) {
    const text = content || input.trim()
    if (!text || !conversationId || sending) return

    setInput('')
    setSending(true)

    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])

    // Add placeholder tutor message
    const tutorMsgId = `msg_${Date.now() + 1}`
    const tutorMsg: ChatMessage = {
      id: tutorMsgId,
      conversation_id: conversationId,
      role: 'tutor',
      content: '',
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tutorMsg])

    try {
      for await (const event of streamChat(conversationId, text)) {
        if (event.type === 'delta') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tutorMsgId ? { ...m, content: m.content + event.text } : m,
            ),
          )
        } else if (event.type === 'message_end') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tutorMsgId ? { ...m, id: event.tutor_message_id } : m,
            ),
          )
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tutorMsgId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m,
        ),
      )
    } finally {
      setSending(false)
    }
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="pt-[50px] md:pt-6 px-5 pb-4 flex items-center justify-between max-w-3xl mx-auto w-full">
        <h1 className="font-jakarta font-bold text-[18px] text-text-primary">Ask Tutor</h1>
        <button className="bg-transparent border-none cursor-pointer p-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="#2c3970" />
            <circle cx="10" cy="10" r="1.5" fill="#2c3970" />
            <circle cx="10" cy="16" r="1.5" fill="#2c3970" />
          </svg>
        </button>
      </div>

      {/* Tutor profile */}
      <div className="flex flex-col items-center px-5 pb-3 max-w-3xl mx-auto w-full">
        <div className="relative">
          <div className="w-[64px] h-[64px] rounded-full overflow-hidden border-2 border-[rgba(140,48,232,0.2)]">
            <img src="/images/tutor-avatar.svg" alt="Fluently Tutor" className="w-full h-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#22c55e] rounded-full border-2 border-white" />
        </div>
        <p className="font-jakarta font-bold text-[17px] text-text-dark mt-2">Fluently</p>
        <p className="font-jakarta font-medium text-[13px] text-primary-light">English Language Expert</p>
      </div>

      {/* Suggestion chips */}
      {suggestions && messages.length <= 1 && (
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto max-w-3xl mx-auto w-full">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSend(s.prompt)}
              className="shrink-0 bg-[rgba(140,48,232,0.1)] rounded-full px-4 py-2 border-none cursor-pointer"
            >
              <span className="font-jakarta text-[13px] font-medium text-primary-light">{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[50%] rounded-[16px] px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#8c30e8] text-white rounded-br-[4px]'
                    : 'bg-white shadow-sm text-text-primary rounded-bl-[4px]'
                }`}
              >
                <p className="font-jakarta text-[14px] leading-relaxed whitespace-pre-wrap">
                  {msg.content || (
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </p>
                <p
                  className={`font-jakarta text-[11px] mt-1 ${
                    msg.role === 'user' ? 'text-white/70' : 'text-text-muted'
                  }`}
                >
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-2 pt-2 bg-white/50">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 font-jakarta text-[14px] text-text-body placeholder:text-[#969696] border-none outline-none bg-transparent"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border-none cursor-pointer transition-opacity ${
              input.trim() ? 'opacity-100' : 'opacity-30'
            }`}
            style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8H14M9 3L14 8L9 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
