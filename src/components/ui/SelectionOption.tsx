interface SelectionOptionProps {
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
  icon?: string
}

export default function SelectionOption({ label, sublabel, selected, onClick, icon }: SelectionOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-5 py-4 rounded-[16px] flex items-center gap-3 text-left border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-[rgba(139,92,246,0.1)] border-[#8b5cf6]'
          : 'bg-white/80 border-transparent'
      }`}
    >
      {icon && <span className="text-[20px] shrink-0">{icon}</span>}
      <div className="flex flex-col gap-0.5">
        <span
          className={`font-jakarta text-[16px] ${
            selected ? 'font-bold text-[#2c3970]' : 'font-medium text-[#2c3970]'
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="font-jakarta text-[13px] font-normal text-[rgba(44,57,112,0.6)]">
            {sublabel}
          </span>
        )}
      </div>
      {selected && (
        <div className="ml-auto shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#8b5cf6" />
            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  )
}
