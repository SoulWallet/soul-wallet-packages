import React from 'react'

const ArrowLeft = ({ color }: any) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 320 512">
      <path d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z" fill={color || '#1C1C1E'} />
    </svg>
  )
}

export default ArrowLeft
