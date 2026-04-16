interface GradientButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

export default function GradientButton({ label, onClick, disabled = false, icon, className = '' }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[364px] h-[56px] rounded-[100px] flex items-center justify-center gap-2 text-white font-jakarta font-bold text-[16px] border-none cursor-pointer transition-opacity duration-200 shadow-button ${
        disabled ? 'opacity-30' : 'opacity-100'
      } ${className}`}
      style={{ background: 'linear-gradient(138deg, #8b5cf6 0%, #6d28d9 100%)' }}
    >
      {label}
      {icon}
    </button>
  )
}

export function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10H16M11 5L16 10L11 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
