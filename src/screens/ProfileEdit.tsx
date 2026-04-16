import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../components/ui/BottomSheet'
import GradientButton, { ArrowIcon } from '../components/ui/GradientButton'
import { useAuth } from '../hooks/useAuth'
import { patch, upload, del } from '../lib/api-client'
import type { User, AvatarData } from '../types/api'

export default function ProfileEdit() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)
  const [showPhotoSheet, setShowPhotoSheet] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await patch<User>('/users/me', {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      })
      updateUser(updated)
      navigate(-1)
    } catch {
      // Handle error
    } finally {
      setSaving(false)
    }
  }

  async function handleFileSelected(file: File) {
    setShowPhotoSheet(false)
    try {
      const data = await upload<AvatarData>('/users/me/avatar', file)
      if (user && data.avatar_url) {
        updateUser({ ...user, avatar_url: data.avatar_url })
      }
    } catch {
      // Handle error
    }
  }

  async function handleRemovePhoto() {
    setShowPhotoSheet(false)
    try {
      await del<AvatarData>('/users/me/avatar')
      if (user) {
        updateUser({ ...user, avatar_url: null })
      }
    } catch {
      // Handle error
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-gradient-to-b from-[#fef7fe] to-[#ecdffd]">
      {/* Header */}
      <div className="absolute top-[50px] left-0 right-0 px-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="bg-transparent border-none cursor-pointer p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2c3970" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-jakarta font-bold text-[20px] text-text-primary">Profile</h1>
      </div>

      {/* Avatar */}
      <div className="absolute top-[110px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="relative">
          <div className="w-[90px] h-[90px] rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#8b5cf6" strokeWidth="2" />
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#8b5cf6" strokeWidth="2" />
              </svg>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowPhotoSheet(true)}
          className="mt-2 font-jakarta font-semibold text-[14px] text-primary bg-transparent border-none cursor-pointer"
        >
          Upload Photo
        </button>
      </div>

      {/* Form */}
      <div className="absolute top-[260px] left-5 right-5 flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="font-jakarta font-medium text-[13px] text-text-muted mb-1 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[52px] bg-white/80 rounded-[12px] px-4 font-jakarta text-[16px] text-text-body border-none outline-none"
          />
        </div>

        {/* Phone (read-only) */}
        <div>
          <label className="font-jakarta font-medium text-[13px] text-text-muted mb-1 block">Mobile Number</label>
          <div className="w-full h-[52px] bg-white/50 rounded-[12px] px-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 4C3 3.44772 3.44772 3 4 3H7L9 7L7 9C7 9 8 12 11 15L13 13L17 15V18C17 18.5523 16.5523 19 16 19C9.37258 19 4 13.6274 4 7V4Z" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
            <span className="font-jakarta text-[16px] text-text-muted">{user?.phone || '+91 XXXXXXXXXX'}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="font-jakarta font-medium text-[13px] text-text-muted mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email ID"
            className="w-full h-[52px] bg-white/80 rounded-[12px] px-4 font-jakarta text-[16px] text-text-body placeholder:text-[#969696] border-none outline-none"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2">
        <GradientButton
          label={saving ? 'Saving...' : 'Update'}
          onClick={handleSave}
          disabled={saving}
          icon={<ArrowIcon />}
        />
      </div>

      {/* Photo upload bottom sheet */}
      <BottomSheet open={showPhotoSheet} onClose={() => setShowPhotoSheet(false)} title="Upload Photo">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-[12px] border-none cursor-pointer text-left"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="18" height="14" rx="2" stroke="#2c3970" strokeWidth="1.5" />
              <circle cx="8" cy="10" r="2" stroke="#2c3970" strokeWidth="1.5" />
              <path d="M20 14L16 10L6 18" stroke="#2c3970" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-jakarta font-medium text-[15px] text-text-primary flex-1">Choose from gallery</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-[12px] border-none cursor-pointer text-left"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M7 4L5 7H3C2.44772 7 2 7.44772 2 8V17C2 17.5523 2.44772 18 3 18H19C19.5523 18 20 17.5523 20 17V8C20 7.44772 19.5523 7 19 7H17L15 4H7Z" stroke="#2c3970" strokeWidth="1.5" />
              <circle cx="11" cy="12" r="3" stroke="#2c3970" strokeWidth="1.5" />
            </svg>
            <span className="font-jakarta font-medium text-[15px] text-text-primary flex-1">Take a photo</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {user?.avatar_url && (
            <button
              onClick={handleRemovePhoto}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border-none cursor-pointer"
            >
              <span className="font-jakarta font-medium text-[14px] text-red-500">Remove photo</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
        />
      </BottomSheet>
    </div>
  )
}
