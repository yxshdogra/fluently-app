import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { get, post, upload } from '../lib/api-client'
import type { Lesson as LessonType, AudioFeedback, LessonCompletionResult } from '../types/api'

export default function Lesson() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: lesson, loading } = useApi<LessonType>(() => get(`/lessons/${id}`), [id])

  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<AudioFeedback | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      setRecording(true)
    } catch {
      // Microphone not available
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function handleSubmitAudio() {
    if (!audioBlob || !id) return
    setSubmitting(true)
    try {
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
      const result = await upload<{ feedback: AudioFeedback }>(`/lessons/${id}/audio`, file)
      setFeedback(result.feedback)
    } catch {
      // Handle error
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComplete() {
    if (!id) return
    try {
      const result = await post<LessonCompletionResult>(`/lessons/${id}/complete`)
      if (result.next_lesson) {
        navigate(`/lesson/${result.next_lesson.id}`, { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    } catch {
      navigate('/home', { replace: true })
    }
  }

  if (loading || !lesson) {
    return (
      <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-[90px] flex items-end justify-between px-5 pb-3 z-10">
        <button onClick={() => navigate('/home')} className="bg-transparent border-none cursor-pointer p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex gap-3">
          <div className="bg-white shadow-sm border border-[rgba(0,0,0,0.08)] rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-[12px]">🔥</span>
            <span className="font-jakarta font-bold text-[12px] text-[#0f1724]">12</span>
          </div>
          <div className="bg-white shadow-sm border border-[rgba(0,0,0,0.08)] rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-[12px]">⭐</span>
            <span className="font-jakarta font-bold text-[12px] text-[#0f1724]">4.9</span>
          </div>
          <div className="bg-white shadow-sm border border-[rgba(0,0,0,0.08)] rounded-full px-3 py-1.5">
            <span className="font-jakarta font-bold text-[12px] text-[#0f1724]">ENG</span>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="absolute top-[200px] left-5 right-5 z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-[20px] p-6 border border-[rgba(0,0,0,0.08)] shadow-card">
          <h2 className="font-jakarta font-bold text-[22px] text-[#0f1724] mb-2">
            {lesson.title}
          </h2>
          <p className="font-jakarta text-[15px] text-text-primary leading-relaxed">
            {lesson.content.prompt_text}
          </p>
          {lesson.content.instructions && (
            <p className="font-jakarta text-[13px] text-text-muted mt-3">
              {lesson.content.instructions}
            </p>
          )}
        </div>
      </div>

      {/* Feedback card */}
      {feedback && (
        <div className="absolute top-[440px] left-5 right-5 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-[16px] p-5">
            <h3 className="font-jakarta font-bold text-[16px] text-text-primary mb-3">Your Score</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-primary/5 rounded-[10px] p-3 text-center">
                <p className="font-jakarta font-bold text-[20px] text-primary">{feedback.overall_score}</p>
                <p className="font-jakarta text-[11px] text-text-muted">Overall</p>
              </div>
              <div className="bg-green-50 rounded-[10px] p-3 text-center">
                <p className="font-jakarta font-bold text-[20px] text-green-600">{feedback.pronunciation_score}</p>
                <p className="font-jakarta text-[11px] text-text-muted">Pronunciation</p>
              </div>
              <div className="bg-blue-50 rounded-[10px] p-3 text-center">
                <p className="font-jakarta font-bold text-[20px] text-blue-600">{feedback.fluency_score}</p>
                <p className="font-jakarta text-[11px] text-text-muted">Fluency</p>
              </div>
              <div className="bg-orange-50 rounded-[10px] p-3 text-center">
                <p className="font-jakarta font-bold text-[20px] text-orange-600">{feedback.grammar_score}</p>
                <p className="font-jakarta text-[11px] text-text-muted">Grammar</p>
              </div>
            </div>
            {feedback.suggestions.length > 0 && (
              <div className="mt-3">
                {feedback.suggestions.map((s, i) => (
                  <p key={i} className="font-jakarta text-[13px] text-text-muted mt-1">• {s}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recording controls */}
      <div className="absolute bottom-[100px] left-0 right-0 flex justify-center items-center gap-6 z-10">
        {!feedback ? (
          <>
            <button
              onClick={() => { setAudioBlob(null); setRecording(false) }}
              className="w-[48px] h-[48px] rounded-full bg-white shadow-sm border border-[rgba(0,0,0,0.08)] flex items-center justify-center cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 7L10 1L16 7" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 1V14" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`w-[72px] h-[72px] rounded-full flex items-center justify-center border-none cursor-pointer ${
                recording ? 'bg-red-500 animate-pulse' : 'bg-primary'
              }`}
            >
              {recording ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" fill="white" />
                  <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 19V23M8 23H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button
              className="w-[48px] h-[48px] rounded-full bg-white shadow-sm border border-[rgba(0,0,0,0.08)] flex items-center justify-center cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-10">
        {audioBlob && !feedback ? (
          <button
            onClick={handleSubmitAudio}
            disabled={submitting}
            className="w-[364px] h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer shadow-button"
            style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
          >
            {submitting ? 'Analyzing...' : 'Submit Recording'}
          </button>
        ) : feedback ? (
          <button
            onClick={handleComplete}
            className="w-[364px] h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer shadow-button"
            style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
          >
            Next
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M11 5L16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : !recording ? (
          <button
            onClick={startRecording}
            className="w-[364px] h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer shadow-button"
            style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
          >
            Start Recording
          </button>
        ) : null}
      </div>
    </div>
  )
}
