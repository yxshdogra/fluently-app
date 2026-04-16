import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { get } from '../lib/api-client'
import type { DashboardData, Module, Lesson } from '../types/api'

const carouselItems = [
  { label: 'Speak with Confidence', image: '/images/speak-confidence.svg' },
  { label: 'Crack Interviews', image: '/images/crack-interviews.svg' },
  { label: 'Ace Exams', image: '/images/ace-exams.svg' },
  { label: 'Office English', image: '/images/office-english.svg' },
  { label: 'Daily Conversations', image: '/images/daily-conversations.svg' },
]

const lessonTypeThumb: Record<string, string> = {
  speaking_drill: '/images/lesson-thumb-speaking.svg',
  conversation: '/images/lesson-thumb-conversation.svg',
  fluency_drill: '/images/lesson-thumb-fluency.svg',
  audio_response: '/images/lesson-thumb-audio.svg',
}

const lessonTitleThumb: Record<string, string> = {
  "yesterday's activities": '/images/lesson-thumb-calendar.svg',
  'your weekend story': '/images/lesson-thumb-weekend.svg',
}

function getLessonThumb(lesson: Lesson) {
  const titleMatch = lessonTitleThumb[lesson.title.toLowerCase()]
  if (titleMatch) return titleMatch
  return lessonTypeThumb[lesson.type] || lessonTypeThumb.speaking_drill
}

function LockIcon({ size = 12, color = '#6b7280' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="2" y="5" width="8" height="6" rx="1.5" stroke={color} strokeWidth="1.2" />
      <path d="M4 5V4C4 2.89543 4.89543 2 6 2C7.10457 2 8 2.89543 8 4V5" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#22c55e" />
      <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 12L10 8L14 12" stroke="#7c4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown({ color = '#6b7280' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 8L10 12L14 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LessonRow({ lesson, onPlay }: { lesson: Lesson; onPlay: (id: string) => void }) {
  const isCompleted = lesson.status === 'completed'
  const isActive = lesson.status === 'available' || lesson.status === 'in_progress'
  const isLocked = lesson.status === 'locked'

  return (
    <div className="flex gap-3 items-center py-4 px-4">
      {/* Thumbnail */}
      <div className="w-[64px] h-[48px] rounded-[8px] shrink-0 overflow-hidden relative bg-[#f3e8ff]">
        <img
          src={getLessonThumb(lesson)}
          alt=""
          className="w-full h-full object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L16 10L7 16V4Z" fill="white" />
            </svg>
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <LockIcon size={16} color="#ffffff" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-jakarta font-bold text-[14px] leading-tight ${isLocked ? 'text-[#6b7280]' : 'text-[#0f1724]'}`}>
          {lesson.title}
        </p>
        {isLocked ? (
          <div className="flex items-center gap-1 mt-1">
            <LockIcon size={12} />
            <span className="font-jakarta font-semibold text-[12px] text-[#6b7280]">Unlock to view</span>
          </div>
        ) : (
          <p className="font-jakarta font-semibold text-[12px] text-[#6b7280] mt-1">
            {lesson.duration_label}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isCompleted && <CheckIcon />}
        {isActive && (
          <button
            onClick={() => onPlay(lesson.id)}
            className="bg-[rgba(147,51,234,0.1)] rounded-full px-3.5 py-1.5 border-none cursor-pointer"
          >
            <span className="font-jakarta font-extrabold text-[12px] text-[#7c4dff]">Play</span>
          </button>
        )}
        {isLocked && <LockIcon size={20} />}
      </div>
    </div>
  )
}

function WeekCard({
  mod,
  expanded,
  onToggle,
  onPlay,
}: {
  mod: Module
  expanded: boolean
  onToggle: () => void
  onPlay: (id: string) => void
}) {
  const isActive = mod.status === 'in_progress'
  const isLocked = mod.status === 'locked'
  const progressPercent = mod.lessons_total > 0 ? (mod.lessons_completed / mod.lessons_total) * 100 : 0

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full bg-white p-4 flex items-center justify-between border-none cursor-pointer text-left">
        <div className="flex-1 pr-4">
          <p className={`font-jakarta font-extrabold text-[15px] ${isLocked ? 'text-[#6b7280]' : 'text-[#0f1724]'}`}>
            {mod.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {isActive ? (
              <>
                <div className="w-[80px] h-1 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7c4dff] rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="font-jakarta font-semibold text-[12px] text-[#6b7280]">
                  {mod.lessons_completed}/{mod.lessons_total} completed
                </span>
              </>
            ) : isLocked ? (
              <div className="flex items-center gap-1">
                {mod.lessons_completed === 0 && mod.week_number > 1 ? (
                  <>
                    <div className="w-[80px] h-1 bg-[rgba(0,0,0,0.08)] rounded-full" />
                    <div className="flex items-center gap-1">
                      <LockIcon size={12} />
                      <span className="font-jakarta font-semibold text-[12px] text-[#6b7280]">
                        Complete Week {mod.week_number - 1} to unlock
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <LockIcon size={12} />
                    <span className="font-jakarta font-semibold text-[12px] text-[#6b7280]">Locked</span>
                  </>
                )}
              </div>
            ) : (
              <span className="font-jakarta font-semibold text-[12px] text-[#6b7280]">
                {mod.lessons_completed}/{mod.lessons_total} completed
              </span>
            )}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isActive ? 'bg-[rgba(147,51,234,0.08)]' : 'border border-[rgba(0,0,0,0.08)]'
        }`}>
          {expanded ? <ChevronUp /> : <ChevronDown color={isActive ? '#7c4dff' : '#6b7280'} />}
        </div>
      </button>

      {/* Lessons */}
      {expanded && mod.lessons.length > 0 && (
        <div className={`border-t border-[rgba(0,0,0,0.08)] ${isLocked ? 'bg-[#f8fafc]' : ''}`}>
          {mod.lessons.map((lesson, i) => (
            <div key={lesson.id}>
              {i > 0 && <div className="mx-4 border-t border-[rgba(0,0,0,0.08)]" />}
              <LessonRow lesson={lesson} onPlay={onPlay} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { data: dashboard } = useApi<DashboardData>(() => get('/users/me/dashboard'), [])
  const { data: modules } = useApi<Module[]>(() => get('/modules'), [])
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1, 2]))

  function toggleWeek(week: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(week)) next.delete(week)
      else next.add(week)
      return next
    })
  }

  function handlePlay(lessonId: string) {
    navigate(`/lesson/${lessonId}`)
  }

  const totalWeeks = dashboard?.progress?.total_weeks || 7

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[44px] bottom-0 left-0 right-0 overflow-y-auto">
        {/* Header */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <div>
            <p className="font-jakarta font-extrabold text-[16px] text-[#0f1724] tracking-[-0.3px]">
              {dashboard?.greeting || 'Good evening'}, {dashboard?.user_name || 'User'} 👋
            </p>
            <p className="font-jakarta font-medium text-[13px] text-[#6b7280] mt-1">
              Let's practice speaking
            </p>
          </div>
          {!dashboard?.is_premium && (
            <button
              onClick={() => navigate('/paywall')}
              className="rounded-full px-3.5 py-1.5 border-none cursor-pointer shadow-[0px_4px_12px_0px_rgba(109,40,217,0.25)]"
              style={{ background: 'linear-gradient(150deg, #8b5cf6 0%, #6d28d9 100%)' }}
            >
              <span className="font-jakarta font-extrabold text-[13px] text-white whitespace-nowrap">
                Become Prime ✨
              </span>
            </button>
          )}
        </div>

        {/* Progress Overview Card */}
        <div className="mx-5 mt-5 relative backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] border border-[rgba(147,51,234,0.15)] rounded-[8px] shadow-[0px_8px_32px_0px_rgba(147,51,234,0.08)] p-6 overflow-hidden">
          {/* Decorative gradient blob */}
          <div
            className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(147,51,234,0) 70%)' }}
          />

          <h2 className="font-jakarta font-extrabold text-[16px] text-[#0f1724] relative z-10">
            Your Fluency Journey
          </h2>

          {/* Week indicators */}
          <div className="mt-6 relative flex items-center justify-between px-1">
            {/* Connecting line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[rgba(0,0,0,0.08)]" />

            {Array.from({ length: totalWeeks }, (_, i) => {
              const week = i + 1
              const wp = dashboard?.progress?.weekly_progress.find((w) => w.week === week)
              const isCurrentWeek = wp?.status === 'in_progress'
              const isCompleted = wp?.status === 'completed'

              return (
                <div key={week} className="relative z-10">
                  {isCurrentWeek ? (
                    <div className="w-7 h-7 rounded-full bg-[#7c4dff] border-2 border-[#7c4dff] flex items-center justify-center shadow-[0px_0px_0px_4px_rgba(147,51,234,0.2)]">
                      <span className="font-jakarta font-extrabold text-[11px] text-white">W{week}</span>
                    </div>
                  ) : isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-[#7c4dff] border-2 border-[#7c4dff] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-[rgba(0,0,0,0.08)] flex items-center justify-center">
                      <LockIcon size={12} color="#9ca3af" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Encouragement banner */}
          <div className="mt-6 bg-[rgba(147,51,234,0.06)] rounded-[6px] px-4 py-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-[4px] bg-[#7c4dff] shadow-[0px_0px_0px_4px_rgba(147,51,234,0.15)]" />
            <p className="font-jakarta font-bold text-[14px] text-[#7c4dff]">
              {dashboard?.fluency_journey_label || "You're on Week 1 — Keep going!"}
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-6 overflow-hidden">
          <div
            className="flex gap-3 pl-5"
            style={{ animation: 'carousel-scroll 20s linear infinite', width: 'max-content' }}
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused' }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running' }}
          >
            {[...carouselItems, ...carouselItems].map((item, i) => (
              <div
                key={i}
                className="shrink-0 w-[140px] h-[160px] bg-white rounded-[16px] border border-[#e6d2ff] shadow-sm flex flex-col items-center justify-end pb-4 px-3"
              >
                <img src={item.image} alt={item.label} className="w-full h-[80px] rounded-[10px] mb-3 object-cover" />
                <span className="font-jakarta font-semibold text-[13px] text-[#0f1724] text-center leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Modules */}
        <h2 className="font-jakarta font-extrabold text-[18px] text-[#0f1724] px-5 mt-8 mb-3">
          Weekly Modules
        </h2>

        <div className="px-5 pb-6 flex flex-col gap-3">
          {modules?.map((mod) => (
            <WeekCard
              key={mod.id}
              mod={mod}
              expanded={expandedWeeks.has(mod.week_number)}
              onToggle={() => toggleWeek(mod.week_number)}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
