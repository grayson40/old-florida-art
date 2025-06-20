import React from 'react'

interface HibiscusFlowerProps {
  className?: string
  size?: number
}

export function HibiscusFlower({ className = '', size = 24 }: HibiscusFlowerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hibiscus flower petals */}
      <path
        d="M12 2C10.5 2 9.5 3.5 9.5 5.5C9.5 6.5 10 7.5 11 8C10 8.5 9.5 9.5 9.5 10.5C9.5 12.5 10.5 14 12 14C13.5 14 14.5 12.5 14.5 10.5C14.5 9.5 14 8.5 13 8C14 7.5 14.5 6.5 14.5 5.5C14.5 3.5 13.5 2 12 2Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M12 14C13.5 14 15 15 15 17C15 18 14.5 19 13.5 19.5C14 20.5 14.5 21.5 14.5 22.5C14.5 24.5 13.5 26 12 26C10.5 26 9.5 24.5 9.5 22.5C9.5 21.5 10 20.5 10.5 19.5C9.5 19 9 18 9 17C9 15 10.5 14 12 14Z"
        fill="currentColor"
        opacity="0.6"
        transform="translate(0, -12)"
      />
      <path
        d="M2 12C2 10.5 3.5 9.5 5.5 9.5C6.5 9.5 7.5 10 8 11C8.5 10 9.5 9.5 10.5 9.5C12.5 9.5 14 10.5 14 12C14 13.5 12.5 14.5 10.5 14.5C9.5 14.5 8.5 14 8 13C7.5 14 6.5 14.5 5.5 14.5C3.5 14.5 2 13.5 2 12Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M22 12C22 13.5 20.5 14.5 18.5 14.5C17.5 14.5 16.5 14 16 13C15.5 14 14.5 14.5 13.5 14.5C11.5 14.5 10 13.5 10 12C10 10.5 11.5 9.5 13.5 9.5C14.5 9.5 15.5 10 16 11C16.5 10 17.5 9.5 18.5 9.5C20.5 9.5 22 10.5 22 12Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Center of flower */}
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.9" />
      {/* Stamen */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

export default HibiscusFlower 