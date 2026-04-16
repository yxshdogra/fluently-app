interface HomeIndicatorProps {
  opacity?: string
}

export default function HomeIndicator({ opacity = '' }: HomeIndicatorProps) {
  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[166px] h-[6px] bg-white rounded-[16px] ${opacity}`}
    />
  )
}
