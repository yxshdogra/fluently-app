interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full flex items-center gap-3">
      <span className="font-jakarta text-[14px] font-semibold text-[#2c3970] whitespace-nowrap">
        Step {current}/{total}
      </span>
      <div className="flex-1 h-[6px] bg-white/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#8b5cf6] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
