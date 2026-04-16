import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { get } from '../lib/api-client'
import type { StaticContent } from '../types/models'

export default function ContentPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useApi<StaticContent>(
    () => get('/content/' + slug),
    [slug],
  )

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Header */}
      <div className="absolute top-[50px] left-0 right-0 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="bg-transparent border-none cursor-pointer p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-jakarta font-bold text-[20px] text-text-primary">
          {data?.title || '\u00A0'}
        </h1>
      </div>

      {/* Content */}
      <div className="absolute top-[110px] bottom-0 left-0 right-0 overflow-y-auto px-5 pb-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="font-jakarta text-[15px] text-text-muted text-center">
              Failed to load content
            </p>
            <button
              onClick={refetch}
              className="font-jakarta font-semibold text-[14px] text-primary bg-white/60 border border-[#e0d4f0] rounded-full px-5 py-2 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {data && (
          <>
            <div
              className="font-jakarta text-[15px] text-text-primary leading-relaxed [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: data.content_html }}
            />

            {data.support_email && (
              <a
                href={`mailto:${data.support_email}`}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-4 bg-primary/10 rounded-[16px] no-underline"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5L10 11L17 5M3 5H17M3 5V15H17V5" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-jakarta font-semibold text-[15px] text-primary">
                  {data.support_email}
                </span>
              </a>
            )}

            <p className="font-jakarta text-[12px] text-text-muted mt-6 text-center">
              Last updated: {new Date(data.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
