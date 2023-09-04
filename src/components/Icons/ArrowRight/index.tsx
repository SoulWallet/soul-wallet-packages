import React from 'react'

const ArrowRight = ({ color }: any) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 320 512">
      <path d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z" fill={color || '#1C1C1E'} />
    </svg>
  )
}

export default ArrowRight
