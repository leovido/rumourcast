'use client'

export function Logo() {
  const handleClick = () => {
    window.location.href = '/'
  }

  return (
    <div
      className="text-lg font-bold flex flex-row items-center font-geist cursor-pointer"
      onClick={handleClick}
    >
      <img src="/rumour.webp" alt="Rumour Cast" className="w-8 h-8 mr-2 rounded-sm" />
      <div className="hidden sm:block">
        <img src="/rumourcast_wordmark.svg" alt="" className="w-full h-8" />
      </div>
    </div>
  )
}
