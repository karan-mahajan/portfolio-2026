import type { AboutBlock as AboutBlockProps, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'

export const AboutBlockComponent: React.FC<AboutBlockProps> = ({
  image,
  sectionLabel,
  heading,
  headingColor,
  description,
}) => {
  const imageMedia = image && typeof image === 'object' ? (image as Media) : null

  return (
    <div id="about" className="my-12 lg:my-16 relative">
      {/* Rotated side label — desktop only */}
      <div className="hidden lg:flex flex-col items-center absolute top-16 left-0">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          {sectionLabel ?? 'ABOUT ME'}
        </span>
        <span className="h-36 w-0.5 bg-[#1a1443]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-8 lg:gap-16 max-w-5xl mx-auto items-center">
        {/* Image */}
        <div className="flex justify-center order-1">
          {imageMedia?.url && (
            <Image
              src={imageMedia.url}
              width={280}
              height={280}
              alt={imageMedia.alt ?? 'Profile photo'}
              className="rounded-lg transition-all duration-1000 hover:scale-110 cursor-pointer w-70 h-auto"
            />
          )}
        </div>

        {/* Text */}
        <div className="order-2 px-4 lg:px-0">
          <p
            className="font-medium mb-5 text-xl uppercase text-center"
            style={{ color: headingColor ?? '#16f2b3' }}
          >
            {heading ?? 'Who am I?'}
          </p>
          <p className="text-gray-200 text-sm lg:text-lg leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
